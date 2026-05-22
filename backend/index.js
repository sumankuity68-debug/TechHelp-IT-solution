
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';

import authRoutes from './src/routes/auth.routes.js';
import contactRoutes from './src/routes/contact.routes.js';
import servicesRoutes from './src/routes/services.routes.js';

dotenv.config();

connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/services', servicesRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'TechHelp API is running',
        timestamp: new Date().toISOString(),
    });
});


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server error',
    });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Run: npx kill-port ${PORT}  then try again.`);
        process.exit(1);
    } else {
        throw err;
    }
});
