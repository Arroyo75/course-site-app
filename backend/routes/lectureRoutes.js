import express from 'express';
import { upload } from '../config/gridfs.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createLecture, getLectures, deleteLecture, updateLecture, downloadLecture } from '../controllers/lectureController.js';

const router = express.Router();

router.get("/:course_id", getLectures);
router.post("/", authMiddleware, upload.single('file'), (req, res) => {
  console.log(req.file);
  console.log(req.body);
  nextTick();
}, createLecture);
router.delete("/:id", authMiddleware, deleteLecture);
router.put("/:id", authMiddleware, updateLecture);
router.get("/download/:id", authMiddleware, downloadLecture);

export default router;