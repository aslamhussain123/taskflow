
import { Router } from 'express';
import { generateTask } from '../controllers/ai.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/generate-task', requireAuth, generateTask);

export default router;
