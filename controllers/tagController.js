const Tag = require("../models/Tag");
const Blog = require("../models/Blog");

// @desc    Create a tag
// @route   POST /api/tags
// @access  Public
const createTag = async (req, res, next) => {
  const { name } = req.body;
  try {
    const tag = new Tag({ name });
    const savedTag = await tag.save();
    res.status(201).json(savedTag);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: `Tag '${name}' already exists` });
    }
    next(error);
  }
};

// @desc    Get all tags
// @route   GET /api/tags
// @access  Public
const getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single tag
// @route   GET /api/tags/:id
// @access  Public
const getTagById = async (req, res, next) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json(tag);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a tag
// @route   PUT /api/tags/:id
// @access  Public
const updateTag = async (req, res, next) => {
  try {
    const { name } = req.body;
    const updatedTag = await Tag.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!updatedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json(updatedTag);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a tag
// @route   DELETE /api/tags/:id
// @access  Public
const deleteTag = async (req, res, next) => {
  try {
    const tagId = req.params.id;
    const tag = await Tag.findById(tagId);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    // Remove the tag from all blogs that reference it
    await Blog.updateMany({ tags: tagId }, { $pull: { tags: tagId } });

    await Tag.findByIdAndDelete(tagId);

    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTag,
  getTags,
  getTagById,
  updateTag,
  deleteTag,
};
