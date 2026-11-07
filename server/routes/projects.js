import { Router } from 'express';
import { getProjects, getProjectBySlug } from '../controllers/projectController.js';

const router = Router();

router.get('/',       getProjects);
router.get('/:slug',  getProjectBySlug);

export default router;
