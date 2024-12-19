import express from "express";
import { getCourses, createCourse, updateCourse, deleteCourse} from '../controllers/courseController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", getCourses);
router.post("/", authMiddleware,  createCourse);
router.delete("/:id", authMiddleware, deleteCourse);
router.put("/:id", authMiddleware, updateCourse);

export default router;