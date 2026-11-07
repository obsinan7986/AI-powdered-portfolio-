import Stats from '../models/Stats.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// POST /api/cv-download  (public — just increments counter)
export const trackCvDownload = asyncHandler(async (_req, res) => {
  await Stats.increment('cvDownloads', 1);
  res.json({ success: true, message: 'CV download recorded.' });
});

// GET /api/admin/stats  (admin only)
export const getStats = asyncHandler(async (_req, res) => {
  const stats = await Stats.getGlobal();
  res.json({ success: true, data: stats });
});
