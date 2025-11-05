const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { validatePreferences } = require('../middleware/validationMiddleware');

// All routes are protected
router.get('/preferences', authMiddleware, userController.getPreferences);
router.put('/preferences', authMiddleware, validatePreferences, userController.updatePreferences);

module.exports = router;