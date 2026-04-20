import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * ForumPost represents a single message in a course discussion thread.
 * Posts are always scoped to a Course, and optionally to a specific Module
 * (e.g. the question lives on "Module 3" rather than the whole course).
 *
 * Socket.io emits new documents in real-time; the REST API provides
 * paginated history on initial load and reconnection catch-up.
 */
const forumPostSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Forum post must belong to a course'],
    },

    /** Optional — null means it is a course-level thread, not module-specific. */
    module: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
      default: null,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },

    text: {
      type: String,
      required: [true, 'Post text is required'],
      trim: true,
      minlength: [1, 'Post cannot be empty'],
      maxlength: [2000, 'Post cannot exceed 2000 characters'],
    },

    /** Soft-delete — hides the post from the UI without losing audit history. */
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.__v;
        delete ret.isDeleted;
        return ret;
      },
    },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Primary query pattern: "give me the last N posts for this course, newest first"
forumPostSchema.index({ course: 1, createdAt: -1 });
// Secondary pattern: "give me posts for this specific module"
forumPostSchema.index({ module: 1, createdAt: -1 });
forumPostSchema.index({ author: 1 });

const ForumPost = mongoose.model('ForumPost', forumPostSchema);
export default ForumPost;
