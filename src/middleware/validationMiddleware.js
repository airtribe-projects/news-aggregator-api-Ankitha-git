const ResponseHandler = require('../utils/responseHandler');

const validationMiddleware = {
  // Validate registration data
  validateRegister: (req, res, next) => {
    const { name, email, password } = req.body;
    const errors = [];

    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!email || !isValidEmail(email)) {
      errors.push('Valid email is required');
    }

    if (!password || password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (errors.length > 0) {
      return ResponseHandler.badRequest(res, 'Validation failed', errors);
    }

    next();
  },

  // Validate login data
  validateLogin: (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email || !isValidEmail(email)) {
      errors.push('Valid email is required');
    }

    if (!password) {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      return ResponseHandler.badRequest(res, 'Validation failed', errors);
    }

    next();
  },

  // Validate preferences data
  validatePreferences: (req, res, next) => {
    const { categories, sources, countries } = req.body;
    const errors = [];

    if (categories && !Array.isArray(categories)) {
      errors.push('Categories must be an array');
    }

    if (sources && !Array.isArray(sources)) {
      errors.push('Sources must be an array');
    }

    if (countries && !Array.isArray(countries)) {
      errors.push('Countries must be an array');
    }

    if (errors.length > 0) {
      return ResponseHandler.badRequest(res, 'Validation failed', errors);
    }

    next();
  },

  // Validate news query parameters
  validateNewsQuery: (req, res, next) => {
    const { page, pageSize } = req.query;
    const errors = [];

    if (page && (isNaN(page) || page < 1)) {
      errors.push('Page must be a positive number');
    }

    if (pageSize && (isNaN(pageSize) || pageSize < 1 || pageSize > 100)) {
      errors.push('Page size must be between 1 and 100');
    }

    if (errors.length > 0) {
      return ResponseHandler.badRequest(res, 'Validation failed', errors);
    }

    next();
  }
};

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = validationMiddleware;