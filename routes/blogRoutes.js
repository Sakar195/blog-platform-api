const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const commentController = require("../controllers/commentController");

const {
  validateBlog,
  validateComment,
} = require("../middleware/validationMiddleware");

router.post("/", validateBlog, blogController.createBlog);
router.get("/", blogController.getBlogs);
router.get("/:id", blogController.getBlogById);
router.put("/:id", validateBlog, blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

router.post("/:id/comments", validateComment, commentController.addComment);
router.get("/:id/comments", commentController.getComments);

module.exports = router;
