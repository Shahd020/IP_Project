import mongoose from 'mongoose';

const { Schema } = mongoose;

const enrollmentSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },

    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },

    status: {
      type: String,
      enum: {
        values: ['saved', 'in-progress', 'completed'],
        message: 'Status must be saved, in-progress, or completed',
      },
      default: 'saved',
    },

    progressPercent: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be negative'],
      max: [100, 'Progress cannot exceed 100'],
    },

    progressText: {
      type: String,
      default: 'Not Started',
      maxlength: [50, 'Progress text too long'],
    },

    completedModules: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
      default: [],
    },

    quizPassed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ student: 1, status: 1 });
enrollmentSchema.index({ course: 1 });

enrollmentSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

// Certificate is earned when the student passes the quiz (score ≥ 80%) AND completes the course.
enrollmentSchema.virtual('hasCertificate').get(function () {
  return this.quizPassed === true && this.status === 'completed';
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;