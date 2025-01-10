import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { markLectureAsCompleted } from '../controllers/progressController.js';

const router = express.Router();

router.post('/courses/:courseId/lectures/:lectureId/complete', authMiddleware, markLectureAsCompleted);

export default router;