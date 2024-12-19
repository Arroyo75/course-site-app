import mongoose from "mongoose";
import Course from "../models/Course.js";

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({}).populate('author', 'name email _id');
        res.status(200).json({success: true, data: courses})
    } catch (error) {
        console.log("Error fetching courses: ", error.message);
        res.status(500).json({success: false, message: "Server error"});
    }
};

export const createCourse = async (req, res) => {
    const { title, description, image } = req.body;

    if(!title || !description || !image) {
        return res.status(400).json({ success: false, message: 'Please fill all fields'});
    }

    const newCourse = new Course({
        title,
        description,
        image,
        author: req.user._id
    });

    try {
        await newCourse.save();
        res.status(201).json({ success: true, data: newCourse});
    } catch {
        console.error("Error creating course: ", error.message);
        res.status(400).json({ succes: false, message: "Server error"});
    }
};

export const updateCourse = async (req, res) => {
    const {id} = req.params;
    const course = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Course Id"});
    }

    try {
        const updatedCourse = await Course.findByIdAndUpdate(id, course, {new: true});
        res.status(200).json({ success: true, data: updatedCourse});
    } catch (error) {
        console.log("Error: updating course: ", error.message);
        res.status(500).json({ success: false, message: "Server error"});
    }
};

export const deleteCourse = async (req, res) => {

    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ succes: false, message: "Server error"});
    }

    try {
        await Course.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Course Deleted Successfully"});
    } catch (error) {
        console.log("Error deleting course: ", error.message);
        res.status(500).json({ success: false, message: "Server error"});
    }
};