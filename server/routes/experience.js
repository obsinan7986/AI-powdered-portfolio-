import { Router } from 'express';
import { getExperience } from '../controllers/experienceController.js';

const router = Router();

router.get('/', getExperience);

export default router;
