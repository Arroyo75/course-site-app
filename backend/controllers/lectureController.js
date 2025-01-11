import mongoose from 'mongoose';
import Lecture from '../models/Lecture.js';
import { deleteFileFromS3, getFileFromS3 } from '../config/s3.js';

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

  if(!mongoose.Types.ObjectId.isValid(id)) {
    if(req.file) {
      await deleteFileFromS3(req.file.key);
    }

    return res.status(404).json({ success: false, message: "Invalid Lecture Id" });
  }

  try {

    const lecture = await Lecture.findById(id);

    if(!lecture) {
      if(req.file) {
        await deleteFileFromS3(req.file.key);
      }
      return res.status(404).json({ success: false, message: "Lecture not found" })
    }

    if(req.file) {
      const oldFileKey = lecture.filePath.split('.com/')[1];
      try {
        await deleteFileFromS3(oldFileKey);
      } catch (error) {
        console.log("Error detecting old file: ", error);
      }

      lecture.filePath = req.file.location;
    }

    if(req.body.title) {
      lecture.title = req.body.title;
    }

    const updatedLecture = await lecture.save();
    res.status(200).json({ success: true, data: updatedLecture});
  } catch (error) {
    if(req.file) {
      await deleteFileFromS3(req.file.key);
    }
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
      return res.status(404).json({ success: false, message: "Lecture not found"});
    }

    const fileKey = lecture.filePath.split('.com/')[1];

    try {
      await deleteFileFromS3(fileKey);
    } catch (error) {
      console.log("Error deleting file from s3: ", error);
    }

    await lecture.deleteOne();

    res.status(200).json({ success: true, message: "Lecture deleted successfully"})
  } catch (error) {
    console.log("Error deleting lecture", error);
    res.status(500).json({ success: false, message: "Server error"});
  }
};

export const downloadLecture = async (req, res) => {
  const { id } = req.params;
  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid lecture id"});
  }
  
  try {
    const lecture = await Lecture.findById(id);

    if(!lecture) {
      return res.status(404).json({ success: false, message: "Lecture not found"});
    }
    
    const fileKey = lecture.filePath.split('.com/')[1];
    const signedUrl = await getFileFromS3(fileKey);

    res.status(200).json({
      success: true,
      data: {
        url: signedUrl,
        filename: lecture.title + '.pdf'
      }
    });
  } catch (error) {
    console.log("Error generating download URL: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};