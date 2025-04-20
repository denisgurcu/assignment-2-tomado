// unfortunately doesn't work 
 
const express = require('express');
const auth = require('../middleware/auth'); // Import the auth middleware
const db = require('../db'); // Import database connection 

const router = express.Router();

// Get all categories (protected route)
router.get('/', auth, async (req, res) => {
  try {
    // Fetch user-specific categories
    const [categories] = await db.query('SELECT * FROM categories');
       console.log(categories); // Log the result to ensure it's correct

    res.json(categories);
  } catch (error) {
    console.error('Database error (GET /categories):', error); // Improved error logging
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific category by ID (protected route)
router.get('/:id', auth, async (req, res) => {
  const categoryId = req.params.id;
  try {
    // Fetch a specific category for the authenticated user
    const [category] = await db.query('SELECT * FROM categories WHERE id = ? AND user_id = ?', [categoryId, req.user.id]);
    if (category.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category[0]);
  } catch (error) {
    console.error('Database error (GET /categories/:id):', error); // just better error logging
    res.status(500).json({ message: 'Server error' });
  }
});

// create a new category (protected route)
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' }); // validation
  }
  try {
    // Insert a new category for the authenticated user
    const [result] = await db.query('INSERT INTO categories (name, user_id) VALUES (?, ?)', [name, req.user.id]);
    res.status(201).json({ message: 'Category created', categoryId: result.insertId });
  } catch (error) {
    console.error('Database error (POST /categories):', error); // just better error logging
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an existing category (protected route)
router.put('/:id', auth, async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' }); // Validation
  }
  try {
    // Update a category for the authenticated user
    const [result] = await db.query(
      'UPDATE categories SET name = ? WHERE id = ? AND user_id = ?',
      [name, categoryId, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found or not authorized' });
    }
    res.json({ message: 'Category updated' });
  } catch (error) {
    console.error('Database error (PUT /categories/:id):', error); // Improved error logging
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a category (protected route)
router.delete('/:id', auth, async (req, res) => {
  const categoryId = req.params.id;
  try {
    // Delete a category for the authenticated user
    const [result] = await db.query('DELETE FROM categories WHERE id = ? AND user_id = ?', [categoryId, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found or not authorized' });
    }
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Database error (DELETE /categories/:id):', error); // Improved error logging
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;