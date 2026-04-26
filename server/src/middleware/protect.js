// src/middleware/protect.js
// Verifies the Access Token on every protected request.
// Pattern from Lab 9 Part 4, extended with short-lived token support.
const jwt = require('jsonwebtoken');

/**
 * Reads the Authorization header, verifies the Access Token,
 * and attaches the decoded payload to req.user.
 * Returns 401 if the token is missing, malformed, or expired.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // { userId, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = protect;
