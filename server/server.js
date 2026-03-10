const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

// ── Ensure uploads directory exists ──
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

app.use(cors({
  origin: (origin, callback) => {
    // Allow Postman, mobile apps (no origin)
    if (!origin) return callback(null, true);
    // Allow localhost dev
    if (origin.startsWith('http://localhost')) return callback(null, true);
    // Allow ALL Vercel deployments (main + preview URLs)
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    // Allow custom domain if set
    if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ── Routes ──
const healthRoutes = require('./routes/healthRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const requirementRoutes = require('./routes/requirementRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/health', healthRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/contact', contactRoutes);

// ── Catch-all for undefined routes ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
});

// ── Error Handler (must be last) ──
app.use(errorHandler);

// ── Database Connection ──
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// ── Start Server ──
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();