import { Router } from 'express';
import * as pollController from './poll.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { requireVerified } from '../../middlewares/verifyAdmin.middleware.js';

const router = Router();

// Admin routes (require authentication + verification)
router.post('/', protect, requireVerified, pollController.createPoll);
router.get('/my-polls', protect, pollController.getMyPolls);
router.get('/:id/stats', protect, pollController.getPollStats);
router.delete('/:id', protect, pollController.deletePoll);
router.put('/:id/voters', protect, pollController.addVoters); // 🆕 NEW ROUTE

// Public route (no auth needed)
router.get('/url/:uniqueUrl', pollController.getPollByUrl);

export default router;
