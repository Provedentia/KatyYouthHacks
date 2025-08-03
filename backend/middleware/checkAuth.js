const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Express middleware to protect routes using a Bearer JWT.
 * Adds `req.userId` when the token is valid.
 */
module.exports = (req, res, next) => {
  // 1. Get the Authorization header
  const authHeader = req.headers.authorization;

  // 2. Must start with "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 3. Extract the token
  const token = authHeader.split(' ')[1];

  // 4. Check that JWT_SECRET is configured
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'JWT_SECRET is not set' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ JWT verified. User ID:', payload.id);
    req.userId = payload.id; // attach user id for downstream handlers
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};