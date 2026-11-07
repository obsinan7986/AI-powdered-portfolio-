import { Router } from 'express';
import { body } from 'express-validator';
import { rateLimit } from 'express-rate-limit';
import { submitContact } from '../controllers/contactController.js';
import { handleValidation } from '../middleware/validate.js';

const router = Router();

// Aggressive rate limit: max 3 messages per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { success: false, error: 'Too many messages. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/',
  contactLimiter,
  [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required.')
      .isLength({ max: 100 }).withMessage('Name must be 100 characters or fewer.'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required.')
      .isEmail().withMessage('Email must be valid.')
      .normalizeEmail(),
    body('subject')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('Subject must be 200 characters or fewer.'),
    body('message')
      .trim()
      .notEmpty().withMessage('Message is required.')
      .isLength({ min: 10, max: 2000 }).withMessage('Message must be 10–2000 characters.'),
  ],
  handleValidation,
  submitContact
);

export default router;
