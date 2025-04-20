const jwt = require('jsonwebtoken');

// Secret key for JWT (should match the one in users.js)
const JWT_SECRET = 'your_jwt_secret';

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach the user ID to the request object
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};