import request from 'supertest';
import mongoose from 'mongoose';

// Setup environment variables before loading the app
process.env.NODE_ENV = 'test';
process.env.MONGO_URI = 'mongodb+srv://aluala9999_db_user:hzPduUOEsSDUvMK5@ac-rkxrar1.weu2tkv.mongodb.net/Techhelp_test?retryWrites=true&w=majority&appName=myCluster';
process.env.JWT_SECRET = 'test_secret_for_auth_integration_tests';

// Import the app
import { app } from '../index.js';
import User from '../src/models/user.js';

describe('Auth Endpoints Integration Tests', () => {
  // Clear the users collection before and after tests
  beforeEach(async () => {
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => mongoose.connection.once('open', resolve));
    }
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  const testUser = {
    name: 'Testy Testerson',
    email: 'testy@example.com',
    phone: '+919876543210',
    password: 'password123',
  };

  // 1. Test registration
  it('should register a new user successfully (but unverified)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.requiresVerification).toBe(true);

    // Verify user is in DB and is unverified
    const dbUser = await User.findOne({ email: testUser.email.toLowerCase() });
    expect(dbUser).toBeDefined();
    expect(dbUser.isVerified).toBe(false);
  });

  it('should fail registration with invalid data', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Testy',
        email: 'invalid-email',
        phone: '123',
        password: '12',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // 2. Test login
  it('should login a verified user and return a JWT token', async () => {
    // Register the user
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    // Manually verify the user in the database
    await User.findOneAndUpdate({ email: testUser.email.toLowerCase() }, { isVerified: true });

    // Attempt login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email.toLowerCase());
  });

  it('should fail login for unverified user', async () => {
    // Register the user (remains unverified)
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    // Attempt login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.requiresVerification).toBe(true);
  });

  it('should fail login with incorrect credentials', async () => {
    // Register the user and verify
    await request(app)
      .post('/api/auth/register')
      .send(testUser);
    await User.findOneAndUpdate({ email: testUser.email.toLowerCase() }, { isVerified: true });

    // Attempt login with wrong password
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // 3. Test getMe (protected route)
  it('should retrieve profile details when authorized with JWT', async () => {
    // Register the user and verify
    await request(app)
      .post('/api/auth/register')
      .send(testUser);
    await User.findOneAndUpdate({ email: testUser.email.toLowerCase() }, { isVerified: true });

    // Login to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    const token = loginRes.body.token;

    // Fetch profile
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(testUser.email.toLowerCase());
    expect(res.body.user.name).toBe(testUser.name);
  });

  it('should deny profile retrieval when token is missing', async () => {
    const res = await request(app)
      .get('/api/auth/me');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not authorized/i);
  });
});
