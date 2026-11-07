import { Router }    from 'express';
import { body }      from 'express-validator';
import { rateLimit } from 'express-rate-limit';
import { handleValidation } from '../middleware/validate.js';
import { asyncHandler }     from '../middleware/errorHandler.js';
import { chat }             from '../utils/ai.js';
import Stats                from '../models/Stats.js';

const router = Router();

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'Too many messages. Please wait a few minutes.' },
  standardHeaders: true,
  legacyHeaders:   false,
});

router.post(
  '/',
  chatLimiter,
  [
    body('message')
      .trim()
      .notEmpty().withMessage('Message is required.')
      .isLength({ max: 500 }).withMessage('Message must be 500 characters or fewer.'),
    body('history')
      .optional()
      .isArray({ max: 20 }).withMessage('History must be an array with at most 20 items.'),
  ],
  handleValidation,
  asyncHandler(async (req, res) => {
    const { message, history = [] } = req.body;
    const trimmedHistory = history.slice(-6);

    try {
      const reply = await chat(trimmedHistory, message);
      await Stats.increment('chatMessages', 1).catch(() => {});
      return res.json({ success: true, reply });
    } catch (err) {
      // err.userMsg is safe to return to the client (no key, no secrets)
      // err.message was already logged inside ai.js
      const userMsg = err.userMsg || 'AI service error. Please try again later.';

      // Map error codes to appropriate HTTP status codes
      const statusMap = {
        MISSING_KEY:          503,
        INVALID_KEY:          503,
        KEY_BLOCKED:          503,
        AUTH_FAILED:          503,
        MODEL_NOT_FOUND:      503,
        RATE_LIMITED:         429,
        SERVICE_UNAVAILABLE:  503,
        BAD_PROVIDER:         500,
        BAD_REQUEST:          400,
        CLAUDE_ERROR:         502,
        UNKNOWN:              502,
      };
      const status = statusMap[err.code] || 502;

      return res.status(status).json({ success: false, error: userMsg, code: err.code });
    }
  })
);

export default router;
