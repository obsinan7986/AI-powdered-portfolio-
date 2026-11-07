import Project from '../models/Project.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/* ===== PUBLIC ===== */

// GET /api/projects
export const getProjects = asyncHandler(async (req, res) => {
  const { category, featured } = req.query;
  const filter = {};

  if (category && category !== 'all') filter.category = category;
  if (featured === 'true') filter.featured = true;

  const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: projects.length, data: projects });
});

// GET /api/projects/:slug
export const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) {
    return res.status(404).json({ success: false, error: 'Project not found.' });
  }
  res.json({ success: true, data: project });
});

/* ===== ADMIN ===== */

// POST /api/admin/projects
export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, data: project });
});

// PUT /api/admin/projects/:id
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) return res.status(404).json({ success: false, error: 'Project not found.' });
  res.json({ success: true, data: project });
});

// DELETE /api/admin/projects/:id
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ success: false, error: 'Project not found.' });
  res.json({ success: true, message: 'Project deleted.' });
});
