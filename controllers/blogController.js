const Blog = require("../models/Blog");
const Tag = require("../models/Tag");
const mongoose = require("mongoose");

//Helper function to find or create tags and return their ids
const getTagIds = async (tagNames) => {
  // If no tags provided, return empty array
  if (!tagNames) {
    return [];
  }

  // If string is provided, split it into array
  const tagsArray =
    typeof tagNames === "string"
      ? tagNames.split(",").map((tag) => tag.trim())
      : Array.isArray(tagNames)
        ? tagNames
        : [];

  if (tagsArray.length === 0) {
    return [];
  }

  const tagPromises = tagsArray.map(async (name) => {
    // Find a tag or upsert if not exist
    const tag = await Tag.findOneAndUpdate(
      { name: name.toLowerCase() },
      { $setOnInsert: { name: name.toLowerCase() } },
      { upsert: true, new: true }
    );
    return tag._id;
  });

  return Promise.all(tagPromises);
};

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res, next) => {
  try {
    const { title, description, tags } = req.body;

    const tagIds = await getTagIds(tags);

    const newBlog = new Blog({
      title,
      description,
      author: req.user.id, // Add author from authenticated user
      tags: tagIds,
    });

    const savedBlog = await newBlog.save();
    const populatedBlog = await Blog.findById(savedBlog._id)
      .populate("tags")
      .populate("author", "username email");

    res.status(201).json(populatedBlog);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res, next) => {
  try {
    const {
      search,
      tags,
      sortBy,
      page = 1,
      limit = 10,
      startDate,
      endDate,
    } = req.query;

    let query = {};

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Tags filter
    if (tags) {
      const tagNames = tags.split(",").map((t) => t.trim().toLowerCase());
      const foundTags = await Tag.find({ name: { $in: tagNames } });
      const tagIds = foundTags.map((t) => t._id);
      query.tags = { $in: tagIds };
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Sorting
    let sortOption = {};
    if (sortBy) {
      switch (sortBy) {
        case "title":
          sortOption.title = 1;
          break;
        case "-title":
          sortOption.title = -1;
          break;
        case "date":
          sortOption.createdAt = 1;
          break;
        case "-date":
          sortOption.createdAt = -1;
          break;
        default:
          sortOption.createdAt = -1;
      }
    } else {
      // Default sort by latest
      sortOption.createdAt = -1;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("tags")
        .populate("author", "username email")
        .populate("comments")
        .lean(),
      Blog.countDocuments(query),
    ]);

    // Prepare pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      blogs,
      pagination: {
        total,
        page: parseInt(page),
        totalPages,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single blog post by ID
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("tags")
      .populate("author", "username email")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username email",
        },
      });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = async (req, res, next) => {
  try {
    const { title, description, tags } = req.body;
    const blogId = req.params.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID format" });
    }

    // Find the blog first to check ownership
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if user is the author of the blog
    console.log("Blog author:", blog.author);
    console.log("Current user:", req.user.id);
    console.log(
      "Author toString:",
      blog.author ? blog.author.toString() : "No author"
    );

    // Handle case where blog has no author (created before authentication)
    if (!blog.author) {
      return res.status(403).json({
        message:
          "This blog has no author. Please re-seed the database or create a new blog.",
      });
    }

    // Convert both to strings for proper comparison
    if (blog.author.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this blog" });
    }

    // Convert tag names to tag IDs
    const tagIds = await getTagIds(tags);

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description, tags: tagIds },
      { new: true, runValidators: true }
    )
      .populate("tags")
      .populate("author", "username email");

    res.status(200).json(updatedBlog);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = async (req, res, next) => {
  try {
    const blogToDelete = await Blog.findById(req.params.id);

    if (!blogToDelete) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if user is the author of the blog
    if (blogToDelete.author.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this blog" });
    }

    await blogToDelete.deleteOne();

    res
      .status(200)
      .json({ message: "Blog and associated comments deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
