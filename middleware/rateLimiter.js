const rateLimit = require("express-rate-limit");

// Create a limiter for general API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// More strict limiter for write operations (POST, PUT, DELETE)
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 30, // start blocking after 30 requests
  message: {
    error:
      "Too many write operations from this IP, please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Specific limiter for comment creation to prevent spam
const commentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 comments per 15 minutes
  message: {
    error:
      "Too many comments created from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  strictLimiter,
  commentLimiter,
};
