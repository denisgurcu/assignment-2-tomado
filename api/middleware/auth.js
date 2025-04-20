const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Extract the Authorization header
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' }); // No header? Reject
  }

  // Extract the token (Expecting "Bearer <token>")
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token missing' }); // No token? Reject
  }

  try {
    // Verify and decode the token using the secret from the environment
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to the request
    next(); // Proceed to the next middleware
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' }); // Invalid or expired token
  }
};