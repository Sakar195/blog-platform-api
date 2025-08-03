const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[field];
    return res.status(400).json({
      message: `${field} '${value}' already exists`,
    });
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({
      message: errors.join(", "),
    });
  }

  // Handle cast errors (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Default error
  res.status(500).json({ message: "An unexpected error occurred" });
};

module.exports = errorHandler;
