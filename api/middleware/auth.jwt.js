require('dotenv').config();  // Ensure environment variables are loaded

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("JWT_SECRET is missing in the environment variables");
  process.exit(1);  // Exit the app if the JWT_SECRET is not found
}

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });  // No token provided
  }

  jwt.verify(token, JWT_SECRET, (err, userData) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = userData;  // Attach the decoded user data to the request
    next();  // Pass control to the next middleware/route handler
  });
};

module.exports = authenticateToken;
