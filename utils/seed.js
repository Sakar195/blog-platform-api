require("dotenv").config({ path: "./.env" });

const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const Tag = require("../models/Tag");
const Comment = require("../models/Comment");
const User = require("../models/User");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Tag.deleteMany({});
    await Blog.deleteMany({});
    await Comment.deleteMany({});
    console.log("Cleared existing data.");

    // Create users first
    const user1 = new User({
      username: "johndoe",
      email: "john@example.com",
      password: "password123",
    });
    const user2 = new User({
      username: "janedoe",
      email: "jane@example.com",
      password: "password123",
    });
    await user1.save();
    await user2.save();
    console.log("Created users.");

    // Create tags first (to match our current system)
    const tag1 = new Tag({ name: "technology" });
    const tag2 = new Tag({ name: "lifestyle" });
    const tag3 = new Tag({ name: "programming" });
    const tag4 = new Tag({ name: "health" });
    await tag1.save();
    await tag2.save();
    await tag3.save();
    await tag4.save();
    console.log("Created tags.");

    // Create blogs with tag references and authors
    const blog1 = new Blog({
      title: "The Future of AI",
      description:
        "A deep dive into the advancements and implications of artificial intelligence technology.",
      author: user1._id,
      tags: [tag1._id, tag3._id], // technology, programming
    });
    const blog2 = new Blog({
      title: "Healthy Living Tips",
      description:
        "Simple and effective tips for maintaining a healthier lifestyle in modern times.",
      author: user2._id,
      tags: [tag2._id, tag4._id], // lifestyle, health
    });
    const blog3 = new Blog({
      title: "Modern Web Development",
      description:
        "Exploring the latest trends and technologies in web development for 2025.",
      author: user1._id,
      tags: [tag1._id, tag3._id], // technology, programming
    });

    await blog1.save();
    await blog2.save();
    await blog3.save();
    console.log("Created blogs.");

    // Create comments with authors
    const comment1 = new Comment({
      text: "Great article! Very insightful analysis of AI trends.",
      author: user2._id,
      blog: blog1._id,
    });
    const comment2 = new Comment({
      text: "Thanks for the tips, very helpful for daily life!",
      author: user1._id,
      blog: blog2._id,
    });
    const comment3 = new Comment({
      text: "Looking forward to implementing these web dev practices.",
      author: user2._id,
      blog: blog3._id,
    });
    const comment4 = new Comment({
      text: "Could you elaborate more on the health benefits?",
      author: user1._id,
      blog: blog2._id,
    });

    await comment1.save();
    await comment2.save();
    await comment3.save();
    await comment4.save();

    // Add comments to blogs
    blog1.comments.push(comment1._id);
    blog2.comments.push(comment2._id, comment4._id);
    blog3.comments.push(comment3._id);

    await blog1.save();
    await blog2.save();
    await blog3.save();

    console.log("Created comments and associated with blogs.");
    console.log("Database seeded successfully!");

    // Log summary
    console.log("\n=== SEED SUMMARY ===");
    console.log(`Created ${await User.countDocuments()} users`);
    console.log(`Created ${await Tag.countDocuments()} tags`);
    console.log(`Created ${await Blog.countDocuments()} blogs`);
    console.log(`Created ${await Comment.countDocuments()} comments`);

    console.log("\n=== TEST USERS ===");
    console.log("User 1: john@example.com / password123");
    console.log("User 2: jane@example.com / password123");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
};

seedData();
