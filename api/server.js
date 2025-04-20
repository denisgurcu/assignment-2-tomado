require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer'); // For handling file uploads

const tasksRouter = require('./routers/tasks');
const categoriesRouter = require('./routers/categories');
const usersRouter = require('./routers/users');

const app = express();

// Use environment variables
const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON requests (preferred over bodyParser.json())
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// Setup multer for file uploads
const uploadDirectory = path.join(__dirname, 'uploads'); // Directory for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Save files to the uploads directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Ensure the uploads directory exists
const fs = require('fs');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}
app.use('/uploads', express.static(uploadDirectory)); // Serve uploaded files statically

// Routers (attach file upload middleware if needed)
app.use('/tasks', upload.single('file'), tasksRouter); // Add multer middleware for file uploads
app.use('/categories', categoriesRouter);
app.use('/users', usersRouter);

// Debugging: Log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  console.log('Query params:', req.query);
  console.log('Headers:', req.headers);
  next();
});

// Default route to handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});