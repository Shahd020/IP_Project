import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * A Module is a single lesson/week inside a Course.
 * `order` determines display sequence; the Course virtual sorts by it.
 * The Quiz and ForumPost models both reference Module for scoped queries.
 */
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

    /** 1-based position of this module within the course. */
    order: {
      type: Number,
      required: [true, 'Module order is required'],
      min: [1, 'Order must be at least 1'],
    },

    videoUrl: {
      type: String,
      trim: true,
      default: '',
    },

    /** Short plain-text summary shown below the video player. */
    videoOverview: {
      type: String,
      trim: true,
      maxlength: [1000, 'Overview cannot exceed 1000 characters'],
      default: '',
    },

    /** Total video length in seconds â€” used to compute estimated watch time. */
    videoDurationSeconds: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// â”€â”€â”€ Indexes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Compound unique index: a course cannot have two modules at the same position.
moduleSchema.index({ course: 1, order: 1 }, { unique: true });

// â”€â”€â”€ Virtuals â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
