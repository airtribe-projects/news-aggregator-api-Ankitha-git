// Simple in-memory cache
class CacheService {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttl = 3600) {
    const expiresAt = Date.now() + (ttl * 1000);
    this.cache.set(key, {
      value,
      expiresAt
    });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  // Clean expired items
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Run cleanup every hour
const cacheService = new CacheService();
setInterval(() => cacheService.cleanup(), 3600000);

module.exports = cacheService;