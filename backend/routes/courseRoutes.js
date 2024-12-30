import express from "express";
import { getCourses, createCourse, updateCourse, deleteCourse, enrollInCourse} from '../controllers/courseController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", getCourses);
router.post("/", authMiddleware,  createCourse);
router.delete("/:id", authMiddleware, deleteCourse);
router.put("/:id", authMiddleware, updateCourse);
router.post("/:id/enroll", authMiddleware, enrollInCourse)

export default router;