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

module.exports = categoriesRouter;
