const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const { validateBlog } = require("../middleware/validationMiddleware");
const { strictLimiter } = require("../middleware/rateLimiter");

router.post("/", strictLimiter, validateBlog, blogController.createBlog);
router.get("/", blogController.getBlogs);
router.get("/:id", blogController.getBlogById);
router.put("/:id", validateBlog, blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

module.exports = router;
