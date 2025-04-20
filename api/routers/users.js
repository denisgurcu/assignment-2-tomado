const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const auth = require('../middleware/auth'); // Middleware to validate JWT tokens

const router = express.Router();

// Use the JWT_SECRET from the environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Sign-Up Endpoint
router.post(
  '/',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if the email already exists
      const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      const result = await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

      res.status(201).json({ message: 'User registered successfully', userId: result[0].insertId });
    } catch (error) {
      console.error('Database error (POST /users):', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login Endpoint
router.post(
  '/sign-in',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if the user exists
      const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length === 0) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const user = users[0];

      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Generate a JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (error) {
      console.error('Database error (POST /users/sign-in):', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get User Profile (Protected Route)
router.get('/profile', auth, async (req, res) => {
  const userId = req.user.id; // Extract the user ID from the JWT token
  try {
    const [users] = await db.query('SELECT id, email, created_at FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Database error (GET /users/profile):', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update User Profile (Protected Route)
router.put('/profile', auth, async (req, res) => {
  const userId = req.user.id; // Extract the user ID from the JWT token
  const { email, password } = req.body;

  try {
    // If a new password is provided, hash it
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update the user's email and/or password
    const [result] = await db.query(
      'UPDATE users SET email = ?, password = ? WHERE id = ?',
      [email || req.user.email, hashedPassword || req.user.password, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Database error (PUT /users/profile):', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete User Account (Protected Route)
router.delete('/profile', auth, async (req, res) => {
  const userId = req.user.id; // Extract the user ID from the JWT token
  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Database error (DELETE /users/profile):', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;