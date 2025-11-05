const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateNewsQuery } = require('../middleware/validationMiddleware');

// Public routes
router.get('/top-headlines', validateNewsQuery, newsController.getTopHeadlines);
router.get('/search', validateNewsQuery, newsController.searchNews);
router.get('/sources', newsController.getSources);

// Protected routes