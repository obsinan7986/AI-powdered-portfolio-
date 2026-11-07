import { Router } from 'express';
import { trackCvDownload } from '../controllers/statsController.js';

const router = Router();

// POST /api/cv-download
router.post('/', trackCvDownload);

export default router;
