import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import * as accountController from '../controllers/account.controller';

const router = Router();

router.use(requireAuth);
router.get('/settings', accountController.getSettings);
router.patch('/settings', accountController.updateSettings);
router.get('/support/tickets', accountController.getTickets);
router.post('/support/tickets', accountController.createTicket);

export default router;