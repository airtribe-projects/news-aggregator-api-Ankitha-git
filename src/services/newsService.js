const cacheService = require('./cacheService');

class NewsService {
  constructor() {
    this.apiKey = process.env.NEWS_API_KEY;
    this.baseURL = process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2';
    this.cacheTTL = parseInt(process.env.CACHE_TTL) || 3600;
  }

  // Fetch top headlines
  async getTopHeadlines(options = {}) {
    const { country = 'us', category, sources, page = 1, pageSize = 20 } = options;
    
    // Create cache key
    const cacheKey = `headlines:${country}:${category}:${sources}:${page}:${pageSize}`;
    
    // Check cache
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Build query parameters
    const params = new URLSearchParams({
      apiKey: this.apiKey,
      page,
      pageSize
    });

    if (country) params.append('country', country);
    if (category) params.append('category', category);
    if (sources) params.append('sources', sources);

    try {
      const response = await fetch(`${this.baseURL}/top-headlines?${params}`);
      const data = await response.json();

      if (data.status !== 'ok') {
        throw new Error(data.message || 'Failed to fetch news');
      }

      // Cache the results
      cacheService.set(cacheKey, data, this.cacheTTL);

      return data;
    } catch (error) {
      console.error('News API error:', error);
      throw error;
    }
  }

  // Search news articles
  async searchNews(query, options = {}) {
    const { 
      from, 
      to, 
      language = 'en', 
      sortBy = 'publishedAt', 
      page = 1, 
      pageSize = 20 
    } = options;

    // Create cache key
    const cacheKey = `search:${query}:${from}:${to}:${language}:${sortBy}:${page}:${pageSize}`;
    
    // Check cache
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Build query parameters
    const params = new URLSearchParams({
      q: query,
      apiKey: this.apiKey,
      language,
      sortBy,
      page,
      pageSize
    });

    if (from) params.append('from', from);
    if (to) params.append('to', to);

    try {
      const response = await fetch(`${this.baseURL}/everything?${params}`);
      const data = await response.json();

      if (data.status !== 'ok') {
        throw new Error(data.message || 'Failed to search news');
      }

      // Cache the results
      cacheService.set(cacheKey, data, this.cacheTTL);

      return data;
    } catch (error) {
      console.error('News search error:', error);
      throw error;
    }
  }

  // Get personalized news based on user preferences
  async getPersonalizedNews(preferences, options = {}) {
    const { page = 1, pageSize = 20 } = options;
    const { categories, sources, countries } = preferences;

    try {
      // If user has specific preferences, use them
      if (categories && categories.length > 0) {
        return await this.getTopHeadlines({
          category: categories[0], // Use first category
          country: countries && countries[0],
          page,
          pageSize
        });
      }

      if (sources && sources.length > 0) {
        return await this.getTopHeadlines({
          sources: sources.join(','),
          page,
          pageSize
        });
      }

      // Default to general news
      return await this.getTopHeadlines({
        country: countries && countries[0] || 'us',
        page,
        pageSize
      });
    } catch (error) {
      console.error('Personalized news error:', error);
      throw error;
    }
  }

  // Get available news sources
  async getSources(options = {}) {
    const { category, language, country } = options;
    
    const cacheKey = `sources:${category}:${language}:${country}`;
    
    // Check cache
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const params = new URLSearchParams({
      apiKey: this.apiKey
    });

    if (category) params.append('category', category);
    if (language) params.append('language', language);
    if (country) params.append('country', country);

    try {
      const response = await fetch(`${this.baseURL}/top-headlines/sources?${params}`);
      const data = await response.json();

      if (data.status !== 'ok') {
        throw new Error(data.message || 'Failed to fetch sources');
      }

      // Cache the results
      cacheService.set(cacheKey, data, this.cacheTTL * 24); // Cache for 24 hours

      return data;
    } catch (error) {
      console.error('News sources error:', error);
      throw error;
    }
  }
}

module.exports = new NewsService();