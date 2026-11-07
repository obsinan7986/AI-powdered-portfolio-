import Skill from '../models/Skill.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/* ===== PUBLIC ===== */

// GET /api/skills
// Returns skills grouped by category
export const getSkills = asyncHandler(async (_req, res) => {
  const skills = await Skill.find().sort({ category: 1, order: 1 });

  // Group by category
  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  res.json({ success: true, count: skills.length, data: skills, grouped });
});

/* ===== ADMIN ===== */

// POST /api/admin/skills
export const createSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.create(req.body);
  res.status(201).json({ success: true, data: skill });
});

// PUT /api/admin/skills/:id
export const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!skill) return res.status(404).json({ success: false, error: 'Skill not found.' });
  res.json({ success: true, data: skill });
});

// DELETE /api/admin/skills/:id
export const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) return res.status(404).json({ success: false, error: 'Skill not found.' });
  res.json({ success: true, message: 'Skill deleted.' });
});
