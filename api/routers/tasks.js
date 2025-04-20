const express = require('express');
const db = require('../db');
// Import multer to handle file uploads (like images)
const multer = require('multer');
// Use our custom storage for multer
const storage = require('../storage');
const upload = multer({ storage }); // this handles uploading 1 file at a time

const tasksRouter = express.Router();

// Get all tasks (with category name  + emoji if they have one - emoji is optional)
tasksRouter.get('/', (req, res) => {
  const sql = `
  SELECT tasks.*, categories.name AS category_name,   categories.emoji AS category_emoji
  FROM tasks 
  LEFT JOIN categories ON tasks.category_id = categories.id
  ORDER BY tasks.created_at DESC
  `;

  // fetch tasks from the database
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).send('Internal Server Error');
    }

  // Send the list of tasks to the frontend
    res.json(results);
  });
});

// Get single task by ID (including its category info)
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

    res.json(results[0]); // Send back just the one task
  });
});

// Add a new task (with optional file)
tasksRouter.post('/', upload.single('file'), (req, res) => {
  let { title, description, category_id, status } = req.body;

  // If no category was selected, make it null - so category is not mandatory for give some peace to the user if they need
  if (!category_id) category_id = null;
  
  // If a file was uploaded, save its name
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

// Update task (can update text + category + file)
tasksRouter.put('/:id', upload.single('file'), (req, res) => {
  const { title, description, category_id, status, remove_image } = req.body;
  const { id } = req.params;

  let sql = `
    UPDATE tasks 
    SET title = ?, description = ?, category_id = ?, status = ?
  `;
  const params = [title, description, category_id, status];

  // If a new image is uploaded, replace the old one
  if (req.file) {
    // If a new file is uploaded, update it
    sql += `, file_name = ?`;
    params.push(req.file.filename);
  } else if (remove_image === 'true') {
    // If image is removed from the modal, clear it from  from the database
    sql += `, file_name = NULL`;
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


// Delete task by ID
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
