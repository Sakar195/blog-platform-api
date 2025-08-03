const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

// @desc    Add a comment to a blog post
// @route   POST /api/comments/blog/:id
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const newComment = new Comment({
      text,
      blog: blogId,
      author: req.user.id, // Add author from authenticated user
    });
    const savedComment = await newComment
      .save()
      .then((comment) => comment.populate("author", "username email"));

    blog.comments.push(savedComment._id);
    await blog.save();

    res.status(201).json(savedComment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all comments for a blog post
// @route   GET /api/comments/blog/:id
// @access  Public
const getComments = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const comments = await Comment.find({ blog: blogId })
      .populate("author", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const commentId = req.params.id;

    // Find comment first to check ownership
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author of the comment
    if (comment.author.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this comment" });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { text },
      { new: true, runValidators: true }
    ).populate("author", "username email");

    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author of the comment
    if (comment.author.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
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
