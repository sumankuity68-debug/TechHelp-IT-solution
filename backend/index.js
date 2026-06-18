
import './src/config/env.js';

import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import contactRoutes from './src/routes/contact.routes.js';
import servicesRoutes from './src/routes/services.routes.js';
import testimonialRoutes from './src/routes/testimonial.routes.js';
import userRoutes from './src/routes/user.routes.js';
import expertRoutes from './src/routes/expert.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';
import { apiLimiter } from './src/middleware/rateLimiter.js';
import sendEmail from './src/utils/sendEmail.js';

connectDB();
const app = express();

// ── CORS — only allow whitelisted origins ────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://techhelp-it-solution.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('.vercel.app') || 
                      origin.startsWith('https://techhelp-it-solution');
                      
    if (isAllowed) return callback(null, true);
    callback(new Error(`CORS: Origin '${origin}' is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Stripe webhook needs raw body — MUST be before express.json() ────────────
app.use(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Global rate limit: 100 req / 15 min per IP ───────────────────────────
app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/users', userRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/api/test-live-email', async (req, res) => {
  try {
    await sendEmail({
      email: 'sumankuity68@gmail.com',
      subject: '✨ Live Render SMTP Diagnostic Test',
      html: '<h1>Live Test</h1><p>If you see this, SMTP is working on Render!</p>'
    });
    res.status(200).json({ success: true, message: 'Email sent successfully from Render!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, stack: err.stack });
  }
});

app.get('/api/test-list-users', async (req, res) => {
  try {
    const User = (await import('./src/models/user.js')).default;
    const users = await User.find({}, 'name email role isVerified createdAt');
    const formatted = users.map(u => `${u.name} | ${u.email} | ${u.role} | Verified: ${u.isVerified} | Created: ${u.createdAt}`).join('\n');
    res.type('text/plain').send(formatted);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/api/test-user-exist', async (req, res) => {
  try {
    const User = (await import('./src/models/user.js')).default;
    const user = await User.findOne({ email: req.query.email });
    res.status(200).json({ success: true, exists: !!user, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'TechHelp API is running (CORS Updated)',
        timestamp: new Date().toISOString(),
    });
});

// ── 404 handler ──────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// ── Global error handler ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    // Handle CORS errors explicitly
    if (err.message && err.message.startsWith('CORS:')) {
        return res.status(403).json({ success: false, message: err.message });
    }
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server error',
    });
});

let server;
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`🔒 CORS allowed origins: ${allowedOrigins.join(', ')}`);
  });

  server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
          console.error(`❌ Port ${PORT} is already in use. Run: npx kill-port ${PORT} then try again.`);
          process.exit(1);
      } else {
          throw err;
      }
  });
}

export { app, server };
