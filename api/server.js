const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

// Import route handlers
const tasksRouter = require('./routers/tasks');
const categoriesRouter = require('./routers/categories');
const usersRouter = require('./routers/users');  // Import usersRouter for user-related routes
const authenticateToken = require('./middleware/auth.jwt');  // Import the authentication middleware

const app = express();

// This makes the uploaded files available to the frontend
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Set the port where the server will run
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register the usersRouter for handling login, register, and profile routes
app.use('/users', usersRouter);  // Place this before any protected routes

// Apply authentication middleware only to routes that require authentication
app.use('/tasks', authenticateToken, tasksRouter);  // Protect tasks routes
app.use('/categories', authenticateToken, categoriesRouter);  // Protect categories routes

// Start the server and listen on the port we specified above
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
