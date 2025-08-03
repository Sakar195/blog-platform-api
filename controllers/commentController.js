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

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Public
const updateComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const commentId = req.params.id;

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { text },
      { new: true, runValidators: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Public
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Remove comment from the associated blog
    await Blog.findByIdAndUpdate(comment.blog, {
      $pull: { comments: comment._id },
    });

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment,
};
