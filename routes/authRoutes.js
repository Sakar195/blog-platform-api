const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateUser, validateLogin, validateUserUpdate } = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");

// Public routes
router.post("/register", authLimiter, validateUser, authController.register);
router.post("/login", authLimiter, validateLogin, authController.login);

// Protected routes
router.get("/profile", protect, authController.getProfile);
router.put("/profile", protect, validateUserUpdate, authController.updateProfile);

module.exports = router;
