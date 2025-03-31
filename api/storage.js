// storage.js
const multer = require('multer');
const path = require('path');

// Configure Multer's storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/uploads')); // Save in /public/uploads/
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with timestamp + original extension
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

module.exports = storage;
