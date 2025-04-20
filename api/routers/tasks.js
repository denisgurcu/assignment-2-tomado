// add and delete works, update doesn't work :((((((((((((((
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const db = require('../db');

// Set up multer for file uploads
const uploadDirectory = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Validation middleware for task input
const validateTaskInput = (req, res, next) => {
  const { title, status } = req.body || {}; // Fallback to an empty object if req.body is undefined

  if (!title || !status) {
    return res.status(400).json({ message: 'Title and status are required' });
  }
  next();
};

// Utility function to safely parse request data
const parseRequestBody = (req) => {
  try {
    return req.body || {};
  } catch (error) {
    console.error('Error parsing request body:', error);
    return {};
  }
};

// Get all tasks for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [tasks] = await db.query('SELECT * FROM tasks WHERE user_id = ?', [req.user.id]);
    res.json(tasks);
  } catch (error) {
    console.error('Database error (GET /tasks):', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific task by ID
router.get('/:id', authMiddleware, async (req, res) => {
  const taskId = req.params.id;
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [task] = await db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [taskId, req.user.id]);
    if (task.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task[0]);
  } catch (error) {
    console.error('Database error (GET /tasks/:id):', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new task
router.post('/', authMiddleware, async (req, res) => {
  console.log('Incoming request body:', req.body); // Debug: Log the incoming request body
  console.log('Authenticated user:', req.user); // Debug: Log the authenticated user

  if (!req.body || Object.keys(req.body).length === 0) {
    console.error('Validation error: Request body is empty');
    return res.status(400).json({ message: 'Request body cannot be empty' });
  }

  const { title, description, status } = req.body;

  if (!title || !status) {
    console.error('Validation error: Title and status are required');
    return res.status(400).json({ message: 'Title and status are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)',
      [title, description || null, status || 'not_started', req.user.id]
    );
    const [newTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(newTask[0]);
  } catch (error) {
    console.error('Error creating task:', error); // Debug: Log any errors
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
});
// Update an existing task
router.put('/:id', authMiddleware, upload.single('file'), async (req, res) => {
  const taskId = req.params.id;

  console.log('Incoming request body:', req.body); // Debugging log
  console.log('Uploaded file:', req.file); // Debugging log

  const { title, description, status, category_id } = req.body;

  if (!title || !status) {
    return res.status(400).json({ message: 'Title and status are required' });
  }

  try {
    let filePath = null;
    if (req.file) {
      filePath = `/uploads/${req.file.filename}`;
    }

    // Update the task in the database
    const [result] = await db.query(
      'UPDATE tasks SET title = ?, description = ?, status = ?, category_id = ?, file_path = ? WHERE id = ? AND user_id = ?',
      [title, description || null, status, category_id || null, filePath, taskId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    // Fetch the updated task to return in the response
    const [updatedTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    res.status(200).json(updatedTask[0]);
  } catch (error) {
    console.error('Error updating task:', error); // Debugging log
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
});
// Delete a task
router.delete('/:id', authMiddleware, async (req, res) => {
  const taskId = req.params.id;
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [result] = await db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Database error (DELETE /tasks/:id):', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;