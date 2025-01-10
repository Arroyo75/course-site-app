import mongoose from 'mongoose';
import Lecture from '../models/Lecture.js';
import { deleteFileFromS3 } from '../config/s3.js';

export const getLectures = async (req, res) => {

  const { course_id } = req.params;

  if(!mongoose.Types.ObjectId.isValid(course_id)) {
    return res.status(404).json({ success: false, message: "Invalid Course Id" });
  }

  try {
    const lectures = await Lecture.find({ course: course_id });
    res.status(200).json({ success: true, data: lectures });
  } catch (error) {
    console.log("Error fetching lectures: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createLecture = async (req, res) => {
  try {
    if(!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a PDF file."});
    }

    const { title, course } = req.body;

    if(!title || !course) {
      await deleteFileFromS3(req.file.key);
      res.status(400).json({ success: false, message: "Please provide title and course."});
    }

    const newLecture = new Lecture({
      title,
      filePath: req.file.location,
      course
    });

    await newLecture.save();
    res.status(201).json({ success: true, data: { ...newLecture._doc, fileUrl: req.file.location }});
  } catch (error) {
    if(req.file) {
      await deleteFileFromS3(req.file.key);
    }
    console.log("Error creating lecture");
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateLecture = async (req, res) => {
  const { id } = req.params;
  const lecture = req.body;

  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Lecture Id" });
  }

  try {
    const updatedLecture = await Lecture.findByIdAndUpdate(id, lecture, {new: true});
    res.status(200).json({ success: true, data: updatedLecture});
  } catch (error) {
    console.log("Error updating lecture: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const deleteLecture = async (req, res) => {
  const { id } = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Lecture Id" });
  }

  try {
    await Lecture.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    console.log("Error deleting lecture", error.message);
    res.status(500).json({ success: false, message: "Server error"});
  }
}