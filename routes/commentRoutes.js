const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { validateComment } = require("../middleware/validationMiddleware");
const { commentLimiter, strictLimiter } = require("../middleware/rateLimiter");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/blog/:id", commentController.getComments);

// Protected routes
router.post("/blog/:id", protect, commentLimiter, validateComment, commentController.addComment);
router.put("/:id", protect, validateComment, commentController.updateComment);
router.delete("/:id", protect, commentController.deleteComment);

module.exports = router;
