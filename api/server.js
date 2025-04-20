require('dotenv').config(); // Load .env

const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer'); // For handling file uploads
const fs = require('fs');

const tasksRouter = require('./routers/tasks');
const categoriesRouter = require('./routers/categories');
const usersRouter = require('./routers/users');

const app = express();

const PORT = process.env.PORT || 3000; // Default to 3000 

// Middleware
app.use(cors()); // Enable Cross-Origin to back and end front end can talk to each other 
app.use(express.json()); //  JSON requests
app.use(express.urlencoded({ extended: true })); //  URL requests

// Setup file uploads
const uploadDirectory = path.join(__dirname, 'uploads'); // Directory for uploaded files
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true }); 
}
const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage }); // Configure multer

app.use('/uploads', express.static(uploadDirectory)); // Serve uploaded files statically

// Debugging attempts :( 
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

// Routers
app.use('/tasks', tasksRouter); // Add file upload middleware in the router if needed
app.use('/categories', categoriesRouter);
app.use('/users', usersRouter);

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});