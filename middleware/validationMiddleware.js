const Joi = require("joi");

const validateBlog = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    tags: Joi.string().optional(), // Allow comma-separated string or undefined
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateComment = (req, res, next) => {
  const schema = Joi.object({
    text: Joi.string().min(1).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateTag = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// User validation schemas
const validateUser = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateUserUpdate = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateBlog,
  validateComment,
  validateTag,
  validateUser,
  validateLogin,
  validateUserUpdate,
};
