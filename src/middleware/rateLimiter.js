// Simple in-memory rate limiter
class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  middleware() {
    return (req, res, next) => {
      const identifier = req.ip || req.connection.remoteAddress;
      const now = Date.now();
      
      if (!this.requests.has(identifier)) {
        this.requests.set(identifier, []);
      }

      const userRequests = this.requests.get(identifier);
      
      // Remove old requests outside the time window
      const validRequests = userRequests.filter(
        timestamp => now - timestamp < this.windowMs
      );

      if (validRequests.length >= this.maxRequests) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil(this.windowMs / 1000)
        });
      }

      validRequests.push(now);
      this.requests.set(identifier, validRequests);
      
      next();
    };
  }

  // Clean up old entries periodically
  cleanup() {
    const now = Date.now();
    for (const [identifier, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter(
        timestamp => now - timestamp < this.windowMs
      );
      
      if (validTimestamps.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validTimestamps);
      }
    }
  }
}

// Create rate limiter instances
const apiLimiter = new RateLimiter(100, 60000); // 100 requests per minute
const authLimiter = new RateLimiter(5, 60000);  // 5 requests per minute for auth

// Clean up every 5 minutes
setInterval(() => {
  apiLimiter.cleanup();
  authLimiter.cleanup();
}, 300000);

module.exports = {
  apiLimiter: apiLimiter.middleware(),
  authLimiter: authLimiter.middleware()
};