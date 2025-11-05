const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    apiName: 'News Aggregator API',
    version: '1.0.0',
    description: 'RESTful API for personalized news aggregation',
    endpoints: {
      authentication: {
        register: {
          method: 'POST',
          path: '/api/auth/register',
          description: 'Register a new user',
          body: {
            name: 'string (required, min 2 chars)',
            email: 'string (required, valid email)',
            password: 'string (required, min 6 chars)'
          }
        },
        login: {
          method: 'POST',
          path: '/api/auth/login',
          description: 'Login user',
          body: {
            email: 'string (required)',
            password: 'string (required)'
          }
        },
        profile: {
          method: 'GET',
          path: '/api/auth/profile',
          description: 'Get current user profile',
          authentication: 'Bearer token required'
        }
      },
      news: {
        topHeadlines: {
          method: 'GET',
          path: '/api/news/top-headlines',
          description: 'Get top headlines',
          queryParams: {
            country: 'string (optional) - e.g., us, gb, in',
            category: 'string (optional) - business, technology, etc.',
            sources: 'string (optional) - comma-separated source IDs',
            page: 'number (optional) - default 1',
            pageSize: 'number (optional) - default 20, max 100'
          }
        },
        search: {
          method: 'GET',
          path: '/api/news/search',
          description: 'Search news articles',
          queryParams: {
            q: 'string (required) - search query',
            from: 'string (optional) - ISO date',
            to: 'string (optional) - ISO date',
            language: 'string (optional) - default en',
            sortBy: 'string (optional) - relevancy, popularity, publishedAt',
            page: 'number (optional)',
            pageSize: 'number (optional)'
          }
        },
        sources: {
          method: 'GET',
          path: '/api/news/sources',
          description: 'Get available news sources',
          queryParams: {
            category: 'string (optional)',
            language: 'string (optional)',
            country: 'string (optional)'
          }
        },
        personalizedFeed: {
          method: 'GET',
          path: '/api/news/feed',
          description: 'Get personalized news feed',
          authentication: 'Bearer token required',
          queryParams: {
            page: 'number (optional)',
            pageSize: 'number (optional)'
          }
        },
        favorites: {
          add: {
            method: 'POST',
            path: '/api/news/favorites',
            description: 'Add article to favorites',
            authentication: 'Bearer token required',
            body: 'Article object with url field required'
          },
          get: {
            method: 'GET',
            path: '/api/news/favorites',
            description: 'Get user favorites',
            authentication: 'Bearer token required'
          },
          remove: {
            method: 'DELETE',
            path: '/api/news/favorites',
            description: 'Remove article from favorites',
            authentication: 'Bearer token required',
            body: {
              url: 'string (required) - article URL'
            }
          }
        }
      },
      userPreferences: {
        get: {
          method: 'GET',
          path: '/api/users/preferences',
          description: 'Get user preferences',
          authentication: 'Bearer token required'
        },
        update: {
          method: 'PUT',
          path: '/api/users/preferences',
          description: 'Update user preferences',
          authentication: 'Bearer token required',
          body: {
            categories: 'array (optional) - e.g., ["technology", "business"]',
            sources: 'array (optional) - e.g., ["bbc-news", "cnn"]',
            countries: 'array (optional) - e.g., ["us", "gb"]'
          }
        }
      }
    },
    categories: [
      'business',
      'entertainment',
      'general',
      'health',
      'science',
      'sports',
      'technology'
    ],
    countries: [
      'ae', 'ar', 'at', 'au', 'be', 'bg', 'br', 'ca', 'ch', 'cn', 'co', 'cu',
      'cz', 'de', 'eg', 'fr', 'gb', 'gr', 'hk', 'hu', 'id', 'ie', 'il', 'in',
      'it', 'jp', 'kr', 'lt', 'lv', 'ma', 'mx', 'my', 'ng', 'nl', 'no', 'nz',
      'ph', 'pl', 'pt', 'ro', 'rs', 'ru', 'sa', 'se', 'sg', 'si', 'sk', 'th',
      'tr', 'tw', 'ua', 'us', 've', 'za'
    ],
    languages: [
      'ar', 'de', 'en', 'es', 'fr', 'he', 'it', 'nl', 'no', 'pt', 'ru', 'sv',
      'ud', 'zh'
    ]
  });
});

module.exports = router;