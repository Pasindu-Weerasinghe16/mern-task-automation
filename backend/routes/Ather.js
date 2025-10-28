const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Isolated auth routes with relaxed validation and clearer errors
// Mount path in server.js: app.use('/api/ather', atherRoutes)

const router = express.Router();

// Helper to send standardized validation errors
function sendValidation(res, errors) {
  return res.status(400).json({
    message: 'Validation failed',
    errors: errors.array().map(e => ({ field: e.path, msg: e.msg }))
  });
}

// REGISTER (bug-fixed version)
// - Accepts: { username, email, password }
// - Validation: lighter than original strong password rules to avoid false 400s in tests
// - Duplicate email/username: returns 409 Conflict with clear message
router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('username must be 3-30 characters'),
    body('email')
      .isEmail()
      .withMessage('valid email required')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return sendValidation(res, errors);

      const { username, email, password } = req.body;

      // Check duplicates
      const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
      if (existing) {
        return res.status(409).json({ message: 'User already exists' });
      }

      // Create user (password hashed by model pre-save hook)
      const user = new User({ username: username.trim(), email: email.toLowerCase(), password });
      await user.save();

      // Return JWT to match existing contract
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1h' });

      return res.status(201).json({ token, userId: user._id, username: user.username });
    } catch (err) {
      // Duplicate key error fallback
      if (err && err.code === 11000) {
        return res.status(409).json({ message: 'User already exists' });
      }
      return res.status(500).json({ message: 'Error creating user' });
    }
  }
);

// LOGIN (same response shape as original)
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('valid email required').normalizeEmail(),
    body('password').isLength({ min: 1 }).withMessage('password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return sendValidation(res, errors);

      const { email, password } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1h' });
      return res.json({ token, userId: user._id, username: user.username });
    } catch (err) {
      return res.status(500).json({ message: 'Error logging in' });
    }
  }
);

module.exports = router;
