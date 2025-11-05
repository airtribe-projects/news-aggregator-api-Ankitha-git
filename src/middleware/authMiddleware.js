const jwt = require('jsonwebtoken');
const ResponseHandler = require('../utils/responseHandler');
const db = require('../config/database');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return ResponseHandler.unauthorized(res, 'No token provided');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const user = db.users.findById(decoded.userId);
    
    if (!user) {
      return ResponseHandler.unauthorized(res, 'User not found');
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return ResponseHandler.unauthorized(res, 'Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      return ResponseHandler.unauthorized(res, 'Token expired');
    }
    return ResponseHandler.error(res, 'Authentication failed');
  }
};

module.exports = authMiddleware;