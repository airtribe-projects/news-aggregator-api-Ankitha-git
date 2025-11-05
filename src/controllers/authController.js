const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const ResponseHandler = require('../utils/responseHandler');

const authController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = db.users.findByEmail(email);
      if (existingUser) {
        return ResponseHandler.badRequest(res, 'User already exists with this email');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = db.users.create({
        name,
        email,
        password: hashedPassword
      });

      // Create default preferences for user
      db.preferences.create(user.id, {
        categories: [],
        sources: [],
        countries: []
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return ResponseHandler.success(
        res,
        {
          user: userWithoutPassword,
          token
        },
        'User registered successfully',
        201
      );
    } catch (error) {
      console.error('Registration error:', error);
      return ResponseHandler.error(res, 'Registration failed');
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = db.users.findByEmail(email);
      if (!user) {
        return ResponseHandler.unauthorized(res, 'Invalid email or password');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return ResponseHandler.unauthorized(res, 'Invalid email or password');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return ResponseHandler.success(res, {
        user: userWithoutPassword,
        token
      }, 'Login successful');
    } catch (error) {
      console.error('Login error:', error);
      return ResponseHandler.error(res, 'Login failed');
    }
  },

  // Get current user profile
  getProfile: async (req, res) => {
    try {
      const user = db.users.findById(req.user.id);
      
      if (!user) {
        return ResponseHandler.notFound(res, 'User not found');
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return ResponseHandler.success(res, userWithoutPassword, 'Profile retrieved successfully');
    } catch (error) {
      console.error('Get profile error:', error);
      return ResponseHandler.error(res, 'Failed to retrieve profile');
    }
  }
};

module.exports = authController;