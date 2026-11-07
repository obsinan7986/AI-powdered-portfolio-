/**
 * Admin-only routes.
 * All routes here require a valid JWT (requireAuth middleware).
 */

import { Router } from 'express';
import { body, param } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';

import {
  createProject, updateProject, deleteProject,
} from '../controllers/projectController.js';
import {
  createExperience, updateExperience, deleteExperience,
} from '../controllers/experienceController.js';
import {
  createSkill, updateSkill, deleteSkill,
} from '../controllers/skillController.js';
import {
  getMessages, markMessageRead, deleteMessage,
} from '../controllers/contactController.js';
import { getStats } from '../controllers/statsController.js';

const router = Router();

// Apply auth to every admin route
router.use(requireAuth);

/* ---------- STATS ---------- */
router.get('/stats', getStats);

/* ---------- MESSAGES ---------- */
router.get('/messages', getMessages);
router.patch(
  '/messages/:id/mark-read',
  [param('id').isMongoId().withMessage('Invalid message ID.')],
  handleValidation,
  markMessageRead
);
router.delete(
  '/messages/:id',
  [param('id').isMongoId().withMessage('Invalid message ID.')],
  handleValidation,
  deleteMessage
);

/* ---------- PROJECTS ---------- */
const projectValidation = [
  body('title').trim().notEmpty().withMessage('Title is required.').isLength({ max: 100 }),
  body('description').trim().notEmpty().withMessage('Description is required.').isLength({ max: 1000 }),
  body('category').isIn(['fullstack', 'frontend', 'design', 'other']).withMessage('Invalid category.'),
  body('techStack').optional().isArray(),
];

router.post(  '/projects',     projectValidation, handleValidation, createProject);
router.put(   '/projects/:id',
  [param('id').isMongoId(), ...projectValidation],
  handleValidation, updateProject
);
router.delete('/projects/:id',
  [param('id').isMongoId().withMessage('Invalid project ID.')],
  handleValidation, deleteProject
);

/* ---------- EXPERIENCE ---------- */
const expValidation = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('company').trim().notEmpty().withMessage('Company is required.'),
  body('startDate').trim().notEmpty().withMessage('Start date is required.'),
];

router.post(  '/experience',     expValidation, handleValidation, createExperience);
router.put(   '/experience/:id',
  [param('id').isMongoId(), ...expValidation],
  handleValidation, updateExperience
);
router.delete('/experience/:id',
  [param('id').isMongoId()],
  handleValidation, deleteExperience
);

/* ---------- SKILLS ---------- */
const skillValidation = [
  body('name').trim().notEmpty().withMessage('Skill name is required.'),
  body('category')
    .isIn(['frontend', 'backend', 'database', 'design', 'tools', 'other'])
    .withMessage('Invalid category.'),
];

router.post(  '/skills',     skillValidation, handleValidation, createSkill);
router.put(   '/skills/:id',
  [param('id').isMongoId(), ...skillValidation],
  handleValidation, updateSkill
);
router.delete('/skills/:id',
  [param('id').isMongoId()],
  handleValidation, deleteSkill
);

export default router;
