const newsService = require('../services/newsService');
const db = require('../config/database');
const ResponseHandler = require('../utils/responseHandler');

const newsController = {
  // Get personalized news feed
  getPersonalizedFeed: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, pageSize = 20 } = req.query;

      // Get user preferences
      const preferences = db.preferences.findByUserId(userId);
      
      if (!preferences) {
        return ResponseHandler.notFound(res, 'User preferences not found');
      }

      // Fetch personalized news
      const news = await newsService.getPersonalizedNews(preferences, {
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      });

      return ResponseHandler.success(res, news, 'Personalized feed retrieved successfully');
    } catch (error) {
      console.error('Personalized feed error:', error);
      return ResponseHandler.error(res, error.message || 'Failed to fetch personalized feed');
    }
  },

  // Get top headlines
  getTopHeadlines: async (req, res) => {
    try {
      const { country, category, sources, page = 1, pageSize = 20 } = req.query;

      const news = await newsService.getTopHeadlines({
        country,
        category,
        sources,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      });

      return ResponseHandler.success(res, news, 'Top headlines retrieved successfully');
    } catch (error) {
      console.error('Top headlines error:', error);
      return ResponseHandler.error(res, error.message || 'Failed to fetch top headlines');
    }
  },

  // Search news
  searchNews: async (req, res) => {
    try {
      const { q, from, to, language, sortBy, page = 1, pageSize = 20 } = req.query;

      if (!q) {
        return ResponseHandler.badRequest(res, 'Search query is required');
      }

      const news = await newsService.searchNews(q, {
        from,
        to,
        language,
        sortBy,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      });

      return ResponseHandler.success(res, news, 'Search results retrieved successfully');
    } catch (error) {
      console.error('Search news error:', error);
      return ResponseHandler.error(res, error.message || 'Failed to search news');
    }
  },

  // Get news sources
  getSources: async (req, res) => {
    try {
      const { category, language, country } = req.query;

      const sources = await newsService.getSources({
        category,
        language,
        country
      });

      return ResponseHandler.success(res, sources, 'News sources retrieved successfully');
    } catch (error) {
      console.error('Get sources error:', error);
      return ResponseHandler.error(res, error.message || 'Failed to fetch news sources');
    }
  },

  // Add article to favorites
  addToFavorites: async (req, res) => {
    try {
      const userId = req.user.id;
      const article = req.body;

      if (!article || !article.url) {
        return ResponseHandler.badRequest(res, 'Article URL is required');
      }

      // Check if already in favorites
      if (db.favorites.exists(userId, article.url)) {
        return ResponseHandler.badRequest(res, 'Article already in favorites');
      }

      const favorite = db.favorites.create(userId, article);

      return ResponseHandler.success(res, favorite, 'Article added to favorites', 201);
    } catch (error) {
      console.error('Add to favorites error:', error);
      return ResponseHandler.error(res, 'Failed to add article to favorites');
    }
  },

  // Get user's favorite articles
  getFavorites: async (req, res) => {
    try {
      const userId = req.user.id;
      const favorites = db.favorites.findByUserId(userId);

      return ResponseHandler.success(res, favorites, 'Favorites retrieved successfully');
    } catch (error) {
      console.error('Get favorites error:', error);
      return ResponseHandler.error(res, 'Failed to retrieve favorites');
    }
  },

  // Remove article from favorites
  removeFromFavorites: async (req, res) => {
    try {
      const userId = req.user.id;
      const { url } = req.body;

      if (!url) {
        return ResponseHandler.badRequest(res, 'Article URL is required');
      }

      const deleted = db.favorites.delete(userId, url);

      if (!deleted) {
        return ResponseHandler.notFound(res, 'Article not found in favorites');
      }

      return ResponseHandler.success(res, null, 'Article removed from favorites');
    } catch (error) {
      console.error('Remove from favorites error:', error);
      return ResponseHandler.error(res, 'Failed to remove article from favorites');
    }
  }
};

module.exports = newsController;