const express = require('express');
// our database connection
const db = require('../db');
const authenticateToken = require('../middleware/auth.jwt');  // Import the authentication middleware

const categoriesRouter = express.Router();

// Get all categories from the database (No authentication required for viewing)
categoriesRouter.get('/', (req, res) => {
  const sql = `SELECT * FROM categories`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.json(results);  // Send back the list of categories as JSON
  });
});

// Add a new category (Requires authentication)
categoriesRouter.post('/', authenticateToken, (req, res) => {
  const { name, emoji } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  const sql = `INSERT INTO categories (name, emoji) VALUES (?, ?)`;

  db.query(sql, [name, emoji || null], (err, result) => {
    if (err) {
      console.error('Error adding category:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(201).json({ message: 'Category added successfully', categoryId: result.insertId });
  });
});

// DELETE a category (Requires authentication)
categoriesRouter.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM categories WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting category:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.json({ message: 'Category deleted successfully' });
  });
});

// PUT - Update an existing category (Requires authentication)
categoriesRouter.put('/:id', authenticateToken, (req, res) => {
  const { name, emoji } = req.body;
  const { id } = req.params;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const sql = `UPDATE categories SET name = ?, emoji = ? WHERE id = ?`;

  db.query(sql, [name, emoji || null, id], (err, result) => {
    if (err) {
      console.error('Error updating category:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.json({ message: 'Category updated successfully' });
  });
});

module.exports = categoriesRouter;
