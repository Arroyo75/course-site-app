import express from 'express';
import multer from 'multer';
import { addLecture, getLectures } from '../controllers/lectureController.js';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.get("/". getLectures);
router.post("/", addLecture);

export default router;