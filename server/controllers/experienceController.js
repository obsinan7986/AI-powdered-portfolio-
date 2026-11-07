import Experience from '../models/Experience.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/* ===== PUBLIC ===== */

// GET /api/experience
export const getExperience = asyncHandler(async (_req, res) => {
  const items = await Experience.find().sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: items.length, data: items });
});

/* ===== ADMIN ===== */

// POST /api/admin/experience
export const createExperience = asyncHandler(async (req, res) => {
  const item = await Experience.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// PUT /api/admin/experience/:id
export const updateExperience = asyncHandler(async (req, res) => {
  const item = await Experience.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ success: false, error: 'Experience entry not found.' });
  res.json({ success: true, data: item });
});

// DELETE /api/admin/experience/:id
export const deleteExperience = asyncHandler(async (req, res) => {
  const item = await Experience.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'Experience entry not found.' });
  res.json({ success: true, message: 'Experience entry deleted.' });
});
