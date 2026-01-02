import { Router } from 'express';
import * as voteController from './vote.controller.js';

const router = Router();

router.post('/request-otp', voteController.requestOTP);
router.post('/cast', voteController.castVote);
router.get('/results/:pollId', voteController.getResults);

export default router;