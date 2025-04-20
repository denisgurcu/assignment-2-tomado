const express = require('express');
// our database connection
const db = require('../db');

const categoriesRouter = express.Router();

// Get all categories from the database
categoriesRouter.get('/', (req, res) => {
  // SQL will get everything from the categories table on the backend side
  const sql = `SELECT * FROM categories`;

  db.query(sql, (err, results) => {
    if (err) {
      // log error - if any 
      console.error('Error fetching categories:', err);
      return res.status(500).send('Internal Server Error');
    }
      // if no error, send back the list of categories as JSON
    res.json(results);
  });
});

// Add a new category
categoriesRouter.post('/', (req, res) => {
  const { name, emoji } = req.body;

  // Check if the name was provided — we can't add a category without it
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  // SQL will insert a new category
  const sql = `INSERT INTO categories (name, emoji) VALUES (?, ?)`;
  // Run the insert query
  db.query(sql, [name, emoji || null], (err, result) => {
    if (err) {
      console.error('Error adding category:', err);
      return res.status(500).send('Internal Server Error');
    }
    // Return a success message and the new category's id
    res.status(201).json({ message: 'Category added successfully', categoryId: result.insertId });
  });
});

// DELETE a category
categoriesRouter.delete('/:id', (req, res) => {
  const { id } = req.params;

  // SQL will delete it
  const sql = `DELETE FROM categories WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting category:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.json({ message: 'Category deleted successfully' });
  });
});

// PUT - Update an existing category
categoriesRouter.put('/:id', (req, res) => {
  const { name, emoji } = req.body;
  const { id } = req.params;

  // Make sure there's a name - we can't save a nameless category
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const sql = `UPDATE categories SET name = ?, emoji = ? WHERE id = ?`;

  // Run the update query
  db.query(sql, [name, emoji || null, id], (err, result) => {
    if (err) {
      console.error('Error updating category:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.json({ message: 'Category updated successfully' });
  });
});

// the export to use it elsewhere
module.exports = categoriesRouter;
