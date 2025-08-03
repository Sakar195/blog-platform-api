require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const blogRoutes = require("./routes/blogRoutes");
const tagRoutes = require("./routes/tagRoutes");
const commentRoutes = require("./routes/commentRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();

// Trust proxy for Railway deployment
app.set("trust proxy", 1);

// Middleware for parsing JSON bodies (as sent by API clients)
app.use(express.json());
// Middleware for parsing URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all requests
app.use(apiLimiter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/comments", commentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
