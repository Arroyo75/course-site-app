import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  course: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Course',
    reqiured: true
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;