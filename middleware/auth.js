const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  let token = req.header('x-auth-token');

  // Fallback to Authorization: Bearer <token>
  if (!token) {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('FATAL ERROR: JWT_SECRET is not defined.');
        return res.status(500).json({ message: 'Server configuration error' });
    }
    
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
