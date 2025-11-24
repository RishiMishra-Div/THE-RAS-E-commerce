// Authentication Middleware - Protects routes that require login
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const auth = (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token, access denied' });
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    
    // Add user info to request
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token verification failed, authorization denied' });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

module.exports = { auth, isAdmin };
