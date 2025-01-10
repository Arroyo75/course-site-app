import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

courseSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
        await mongoose.model('Progress').deleteMany({ course: this._id });
        
        await mongoose.model('Lecture').deleteMany({ course: this._id });
        
        next();
    } catch (error) {
        next(error);
    }
});

const Course = mongoose.model('Course', courseSchema);

export default Course;