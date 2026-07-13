import jwt from 'jsonwebtoken';
import Faculty from '../models/Faculty.js';

export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized, token missing.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'ADMIN') {
      req.user = { role: 'ADMIN', email: decoded.email, name: 'Super Admin' };
    } else {
      req.user = await Faculty.findById(decoded.id);
      if (!req.user || !req.user.isActive) return res.status(401).json({ success: false, message: 'User suspended or missing.' });
      req.user.role = 'FACULTY';
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Session signature expired or corrupted.' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: `Role tiering exception: Access Denied.` });
  }
  next();
};