import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getCourseProgress, markLectureAsCompleted } from '../controllers/progressController.js';

const router = express.Router();

router.get('/courses/:courseId', authMiddleware, getCourseProgress);
router.post('/courses/:courseId/lectures/:lectureId/complete', authMiddleware, markLectureAsCompleted);

export default router;