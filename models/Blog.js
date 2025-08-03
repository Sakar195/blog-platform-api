const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Text index for search functionality
blogSchema.index({ title: "text", description: "text" });

// Compound index for efficient sorting and filtering
blogSchema.index({ createdAt: -1, title: 1 });

// Index for tags for faster queries when filtering by tags
blogSchema.index({ tags: 1 });

//delete all comments associated to that blog before the blog is deleted
blogSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const blog = this;

    if (blog.comments && blog.comments.length > 0) {
      await Comment.deleteMany({ _id: { $in: blog.comments } });
    }

    next();
  }
);

module.exports = mongoose.model("Blog", blogSchema);
