import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createLecture, getLectures, deleteLecture, updateLecture } from '../controllers/lectureController.js';
import { uploadLecture, handleUploadErrors } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get("/:course_id", getLectures);
router.post("/", authMiddleware, uploadLecture, handleUploadErrors, createLecture);
router.delete("/:id", authMiddleware, deleteLecture);
router.put("/:id", authMiddleware, uploadLecture, handleUploadErrors, updateLecture);

export default router;