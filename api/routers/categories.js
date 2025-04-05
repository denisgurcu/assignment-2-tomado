const express = require('express');
const db = require('../db');

const categoriesRouter = express.Router();

// Get all categories
categoriesRouter.get('/', (req, res) => {
  const sql = `SELECT * FROM categories`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.json(results);
  });
});

// Add a new category
categoriesRouter.post('/', (req, res) => {
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

// DELETE /categories/:id
categoriesRouter.delete('/:id', (req, res) => {
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

// PUT /categories/:id
categoriesRouter.put('/:id', (req, res) => {
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
