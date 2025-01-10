import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  course: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Course',
    required: true
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  completedLectures: [{
    lecture: {
      type:mongoose.Schema.ObjectId,
      ref: 'Lecture'
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
})

progressSchema.index({ course: 1, student: 1 }, { unqiue: true });

progressSchema.pre('save', async function(next) {
  const Lecture = mongoose.model('Lecture');

  this.completedLectures = await Promise.all(
    this.completedLectures.filter(async (item) => {
      const lectureExists = await Lecture.exists({ _id: item.lecture });
      return lectureExists;
    })
  )

  next();
})

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;