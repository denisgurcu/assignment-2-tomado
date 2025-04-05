const express = require('express');
const db = require('../db');
const multer = require('multer');
const storage = require('../storage');
const upload = multer({ storage });

const tasksRouter = express.Router();

// Get all tasks (with category name)
tasksRouter.get('/', (req, res) => {
  const sql = `
  SELECT tasks.*, categories.name AS category_name,   categories.emoji AS category_emoji
  FROM tasks 
  LEFT JOIN categories ON tasks.category_id = categories.id
  ORDER BY tasks.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.json(results);
  });
});

// Get single task by ID
tasksRouter.get('/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
  SELECT tasks.*, categories.name AS category_name, categories.emoji
  FROM tasks 
    JOIN categories ON tasks.category_id = categories.id
    WHERE tasks.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching task by ID:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.json(results[0]);
  });
});

// Add a new task (with optional file)
tasksRouter.post('/', upload.single('file'), (req, res) => {
  let { title, description, category_id, status } = req.body;
  if (!category_id) category_id = null;
  
  const file_name = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO tasks (title, description, category_id, status, file_name) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, description, category_id, status, file_name], (err, result) => {
    if (err) {
      console.error('Error adding task:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.json({ message: 'Task added successfully', taskId: result.insertId });
  });
});

// Update task (optional file)
tasksRouter.put('/:id', upload.single('file'), (req, res) => {
  const { title, description, category_id, status } = req.body;
  const { id } = req.params;

  let sql = `
    UPDATE tasks 
    SET title = ?, description = ?, category_id = ?, status = ?
  `;

  const params = [title, description, category_id, status];

  if (req.file) {
    sql += `, file_name = ?`;
    params.push(req.file.filename);
  }

  sql += ` WHERE id = ? LIMIT 1`;
  params.push(id);

  db.query(sql, params, (err) => {
    if (err) {
      console.error('Error updating task:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.json({ message: 'Task updated successfully' });
  });
});

// Delete task
tasksRouter.delete('/:id', (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM tasks WHERE id = ? LIMIT 1`;

  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.json({ message: 'Task deleted successfully' });
  });
});

module.exports = tasksRouter;
