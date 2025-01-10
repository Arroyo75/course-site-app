import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createLecture, getLectures, deleteLecture, updateLecture } from '../controllers/lectureController.js';
import { uploadLecture, handleUploadErrors } from '../middleware/uploadMiddleware.js';
import { deleteFileFromS3 } from '../config/s3.js';

const router = express.Router();

router.get("/:course_id", getLectures);
router.post("/", authMiddleware, uploadLecture, handleUploadErrors, createLecture);
router.delete("/:id", authMiddleware, deleteLecture);
router.put("/:id", authMiddleware, updateLecture);

export default router;