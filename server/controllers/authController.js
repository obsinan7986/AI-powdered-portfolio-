import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Generate a signed JWT for the given admin id.
 */
function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  // Find admin — explicitly include password field (it's select: false by default)
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!admin) {
    // Generic message to prevent email enumeration
    return res.status(401).json({ success: false, error: 'Invalid credentials.' });
  }

  const match = await admin.comparePassword(password);
  if (!match) {
    return res.status(401).json({ success: false, error: 'Invalid credentials.' });
  }

  const token = signToken(admin._id);

  res.json({
    success: true,
    token,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    admin: admin.toJSON(), // password stripped by toJSON()
  });
});

// GET /api/auth/me  (protected)
export const getMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin.id);
  if (!admin) return res.status(404).json({ success: false, error: 'Admin not found.' });
  res.json({ success: true, data: admin });
});
