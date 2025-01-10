import mongoose from 'mongoose';
import Progress from './Progress.js';

const lectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    filePath: {
        type: String //file
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }
}, {
    timestamps: true
});

lectureSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
      await mongoose.model('Progress').updateMany(
        { 'completedLectures.lecture': this._id },
        { $pull: { completedLectures: { lecture: this._id } } }
      );
      next();
    } catch (error) {
      next(error);
    }
});

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;