const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { validateComment } = require("../middleware/validationMiddleware");
const { commentLimiter, strictLimiter } = require("../middleware/rateLimiter");

// Routes for specific blog comments
router.post(
  "/blog/:id",
  commentLimiter,
  validateComment,
  commentController.addComment
);
router.get("/blog/:id", commentController.getComments);

// Routes for individual comments
router.put("/:id", validateComment, commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;
