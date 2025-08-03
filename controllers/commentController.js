const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

// @desc    Add a comment to a blog post
// @route   POST /api/blogs/:id/comments
// @access  Public
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const newComment = new Comment({ text, blog: blogId });
    const savedComment = await newComment.save();

    blog.comments.push(savedComment._id);
    await blog.save();

    res.status(201).json(savedComment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all comments for a blog post
// @route   GET /api/blogs/:id/comments
// @access  Public
const getComments = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const comments = await Comment.find({ blog: blogId });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  getComments,
};
