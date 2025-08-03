require("dotenv").config({ path: "./.env" });

const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const Tag = require("../models/Tag");
const Comment = require("../models/Comment");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Clear existing data
    await Tag.deleteMany({});
    await Blog.deleteMany({});
    await Comment.deleteMany({});
    console.log("Cleared existing data.");

    // Create tags
    const tag1 = new Tag({ name: "technology" });
    const tag2 = new Tag({ name: "lifestyle" });
    await tag1.save();
    await tag2.save();
    console.log("Created tags.");

    // Create blogs
    const blog1 = new Blog({
      title: "The Future of AI",
      description:
        "A deep dive into the advancements and implications of artificial intelligence.",
      tags: [tag1._id],
    });
    const blog2 = new Blog({
      title: "Healthy Living Tips",
      description: "Simple and effective tips for a healthier lifestyle.",
      tags: [tag2._id],
    });
    await blog1.save();
    await blog2.save();
    console.log("Created blogs.");

    // Create comments
    const comment1 = new Comment({
      text: "Great article! Very insightful.",
      blog: blog1._id,
    });
    const comment2 = new Comment({
      text: "Thanks for the tips, very helpful!",
      blog: blog2._id,
    });
    await comment1.save();
    await comment2.save();

    // Add comments to blogs
    blog1.comments.push(comment1._id);
    blog2.comments.push(comment2._id);
    await blog1.save();
    await blog2.save();

    console.log("Created comments and associated with blogs.");

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
};

seedData();
