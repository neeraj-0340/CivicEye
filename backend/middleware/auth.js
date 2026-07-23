import jwt from 'jsonwebtoken';
import 'dotenv/config';

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const secretKey = process.env.KEY;
    if (!secretKey) {
      return res.status(500).json({ message: 'Server configuration error: KEY missing' });
    }
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Add user from token payload to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;