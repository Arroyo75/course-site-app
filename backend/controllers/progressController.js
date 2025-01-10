import Progress from '../models/Progress.js';
import Lecture from '../models/Lecture.js';

export const markLectureAsCompleted = async (req, res) => {
  const { courseId, lectureId } = req.params;
  const studentId = req.user._id;

  try {
    const lecture = await Lecture.findOne({
      _id: lectureId,
      course: courseId
    });

    if(!lecture) {
      return res.status(404).json({ success: false, message: "Lecture not found in this course" });
    }

    let progress = await Progress.findOne({
      course: courseId,
      student: studentId
    });
  
    if(!progress) {
      progress = new Progress({
        course: courseId,
        student: studentId,
        completedLectures: []
      })
    }

    const alreadyCompleted = progress.completedLectures.some(
      item => item.lecture.toString() === lectureId
    );

    if(!alreadyCompleted) {
      progress.completedLectures.push({
        lecture: lectureId,
        completedAt: new Date()
      });
      await progress.save();
    }

    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    console.error("Error marking lecture as completed: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}