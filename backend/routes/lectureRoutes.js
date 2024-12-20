import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createLecture, getLectures, deleteLecture, updateLecture } from '../controllers/lectureController.js';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.get("/:course_id", getLectures);
router.post("/", authMiddleware, createLecture);
router.delete("/:id", authMiddleware, deleteLecture);
router.put("/:id", authMiddleware, updateLecture);

export default router;