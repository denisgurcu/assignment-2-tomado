const multer = require('multer');
const path = require('path');

// multer's storage 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/uploads')); // save in /public/uploads/
  },
  filename: (req, file, cb) => {
    // generate a unique filename with timestamp + original extension
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

module.exports = storage;
