import mongoose from 'mongoose';

const { Schema } = mongoose;

const moduleSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Module must belong to a course'],
    },

    title: {
      type: String,
      required: [true, 'Module title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },

    order: {
      type: Number,
      required: [true, 'Module order is required'],
      min: [1, 'Order must be at least 1'],
    },

    description: {
      type: String,
      trim: true,
      default: '',
    },

    videoOverview: {
      type: String,
      trim: true,
      maxlength: [1000, 'Overview cannot exceed 1000 characters'],
      default: '',
    },

    videoDurationSeconds: {
      type: Number,
      default: 0,
    },

    videoUrl: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

moduleSchema.index({ course: 1, order: 1 }, { unique: true });

moduleSchema.virtual('quiz', {
  ref: 'Quiz',
  localField: '_id',
  foreignField: 'module',
  justOne: true,
});

moduleSchema.virtual('forumPosts', {
  ref: 'ForumPost',
  localField: '_id',
  foreignField: 'module',
  options: { sort: { createdAt: -1 } },
});

const Module = mongoose.model('Module', moduleSchema);

export default Module;