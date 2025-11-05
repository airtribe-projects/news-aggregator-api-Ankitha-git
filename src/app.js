const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');


app.use('/api/auth/register', authLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/news', apiLimiter);
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');

// Import response handler
const ResponseHandler = require('./utils/responseHandler');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  ResponseHandler.success(res, { 
    status: 'OK',
    timestamp: new Date().toISOString()
  }, 'API is running');
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to News Aggregator API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      news: '/api/news',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  ResponseHandler.notFound(res, 'Route not found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  ResponseHandler.error(
    res,
    err.message || 'Internal server error',
    err.status || 500
  );
});

module.exports = app;
