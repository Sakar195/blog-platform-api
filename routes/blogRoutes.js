const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const { validateBlog } = require("../middleware/validationMiddleware");
const { strictLimiter } = require("../middleware/rateLimiter");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

// Public routes
router.get("/", optionalAuth, blogController.getBlogs); // Optional auth to show author info
router.get("/:id", optionalAuth, blogController.getBlogById); // Optional auth to show author info

// Protected routes
router.post("/", protect, strictLimiter, validateBlog, blogController.createBlog);
router.put("/:id", protect, validateBlog, blogController.updateBlog);
router.delete("/:id", protect, blogController.deleteBlog);

module.exports = router;
