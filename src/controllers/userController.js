const db = require('../config/database');
const ResponseHandler = require('../utils/responseHandler');

const userController = {
  // Get user preferences
  getPreferences: async (req, res) => {
    try {
      const userId = req.user.id;
      const preferences = db.preferences.findByUserId(userId);

      if (!preferences) {
        return ResponseHandler.notFound(res, 'Preferences not found');
      }

      return ResponseHandler.success(res, preferences, 'Preferences retrieved successfully');
    } catch (error) {
      console.error('Get preferences error:', error);
      return ResponseHandler.error(res, 'Failed to retrieve preferences');
    }
  },

  // Update user preferences
  updatePreferences: async (req, res) => {
    try {
      const userId = req.user.id;
      const { categories, sources, countries } = req.body;

      const updatedPreferences = db.preferences.update(userId, {
        categories: categories || [],
        sources: sources || [],
        countries: countries || []
      });

      if (!updatedPreferences) {
        // Create preferences if they don't exist
        const newPreferences = db.preferences.create(userId, {
          categories: categories || [],
          sources: sources || [],
          countries: countries || []
        });
        return ResponseHandler.success(res, newPreferences, 'Preferences created successfully', 201);
      }

      return ResponseHandler.success(res, updatedPreferences, 'Preferences updated successfully');
    } catch (error) {
      console.error('Update preferences error:', error);
      return ResponseHandler.error(res, 'Failed to update preferences');
    }
  }
};

module.exports = userController;