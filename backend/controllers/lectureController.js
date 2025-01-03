import mongoose from 'mongoose';
import Lecture from '../models/Lecture.js';
import { gfs } from '../config/gridfs.js';

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
  const { title, course } = req.body;

  try {

    console.log(req.file);

    if(!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file"
      })
    }

    if(!title || !course) {
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }
    
    const newLecture = new Lecture({
      title: title,
      filePath: req.file.id,
      course: course
    });

    await newLecture.save();

    res.status(201).json({
      success: true,
      data: {
        ...newLecture._doc,
        originalName: req.file.metadata.originalName
      }
    });
  } catch(error) {
    console.log("Error creating lecture: ", error.message);
    res.status(500).json({ success: false, message: "Server error"});
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
    const lecture = await Lecture.findById(id);
    if(!lecture) {
      return req.status(404).json({ success: false, message: "Lecture not found"});
    }

    await gfs.delete(new mongoose.Types.ObjectId(lecture.filePath));

    await Lecture.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    console.log("Error deleting lecture", error.message);
    res.status(500).json({ success: false, message: "Server error"});
  }
}

export const downloadLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if(!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found"
      });
    }

    const file = await gfs.find({ _id: new mongoose.Types.ObjectId(lecture.filePath) }).toArray();
    if(!file || file.length === 0) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }

    res.header('Content-Type', 'application/pdf');
    res.header('Content-Disposition', `attachment; filename="${file[0].metadata.originalName}"`);

    const downloadStream = gfs.openDownloadStream(new mongoose.Types.ObjectId(lecture.filePath));
    downloadStream.pipe(res);
  } catch (error) {
    console.log("Error downloading file: ", error.message);
    res.status(500).json({ success: false, message: "Server error"});
  }
};