/**
 * Centralized error handler middleware.
 * Must be registered LAST in Express (after all routes).
 *
 * All route handlers can call next(err) or throw inside
 * an async wrapper and land here.
 */

export function errorHandler(err, req, res, _next) {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} — ${err.message}`);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, error: messages.join('. ') });
  }

  // Mongoose duplicate key (e.g. unique slug)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      error: `A record with that ${field} already exists.`,
    });
  }

  // Mongoose cast error (bad ObjectId in URL)
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid ID format.' });
  }

  const status  = err.status  || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'An internal server error occurred.'
      : err.message || 'Something went wrong.';

  res.status(status).json({ success: false, error: message });
}

/**
 * Wraps an async route handler so unhandled promise rejections
 * are forwarded to the error handler without try/catch boilerplate.
 *
 * Usage:  router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
