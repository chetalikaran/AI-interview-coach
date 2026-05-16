import { Router } from 'express';
import {
  createAnswerFeedback,
  createInterviewSession,
  listInterviewSessions,
} from '../controllers/interviewController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.use(requireAuth);

router.post('/sessions', createInterviewSession);
router.get('/sessions', listInterviewSessions);
router.post('/sessions/:sessionId/answers', createAnswerFeedback);

export default router;
