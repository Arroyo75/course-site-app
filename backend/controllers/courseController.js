import mongoose from "mongoose";
import Course from "../models/Course.js";
import User from "../models/User.js";

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
    const userId = req.user._id;

    if(!title || !description || !image) {
        return res.status(400).json({ success: false, message: 'Please fill all fields'});
    }

    const newCourse = new Course({
        title,
        description,
        image,
        author: userId
    });

    try {
        await newCourse.save();

        const user = await User.findById(userId);
        user.createdCourses.push(newCourse._id);
        await user.save();

        res.status(201).json({ success: true, data: newCourse});
    } catch(error) {
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

export const enrollInCourse = async (req, res) => {

    const courseId = req.params.id;
    const userId = req.user._id;

    if(!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(404).json({ success: false, message: "Invalid Course Id" });
    }

    try {
        const course = await Course.findById(courseId);
        if(!course) {
            return res.status(404).json({ success: false, message: "Course not found"});
        }

        if(course.students.includes(userId)) {
            return res.status(500).json({ success: false, message: "Student already enrolled"});
        }

        course.students.push(userId);
        await course.save();

        const user = await User.findById(userId);
        user.enrolledCourses.push(courseId);
        await user.save();

        res.status(200).json({ success: true, message: "Successfully enrolled in a course", userId: userId, course: course});

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}