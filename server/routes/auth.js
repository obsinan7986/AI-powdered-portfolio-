import { Router } from 'express';
import { body } from 'express-validator';
import { rateLimit } from 'express-rate-limit';
import { login, getMe } from '../controllers/authController.js';
import { handleValidation } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Strict rate limit on auth: 10 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  [
    body('email').trim().notEmpty().withMessage('Email is required.').isEmail().normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  handleValidation,
  login
);

// GET /api/auth/me  — protected
router.get('/me', requireAuth, getMe);

export default router;
