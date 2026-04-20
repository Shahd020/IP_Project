<<<<<<< HEAD
// src/models/ForumPost.js
const mongoose = require('mongoose');

// Embedded sub-document for replies.
// Replies are embedded (not referenced) because:
//  1. They are never queried independently — always loaded with their parent post.
//  2. Embedding keeps the real-time Socket.io push simple (one document update).
//  3. Expected reply count per post is bounded (< 200), so document size stays safe.
const replySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reply must have an author'],
    },
    body: {
      type: String,
      required: [true, 'Reply body is required'],
      maxlength: [2000, 'Reply cannot exceed 2000 characters'],
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt on each reply for ordering in the UI
  }
);

const forumPostSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Forum post must belong to a course'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Forum post must have an author'],
    },
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    body: {
      type: String,
      required: [true, 'Post body is required'],
      maxlength: [5000, 'Post body cannot exceed 5000 characters'],
      trim: true,
    },
    // Instructors and admins can pin important announcements to the top
    isPinned: {
      type: Boolean,
      default: false,
    },
    replies: {
      type: [replySchema],
      default: [],
    },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
// Most common query pattern: "all posts for course X, newest first"
forumPostSchema.index({ course: 1, createdAt: -1 });
forumPostSchema.index({ author: 1 });

const ForumPost = mongoose.model('ForumPost', forumPostSchema);

module.exports = ForumPost;
=======
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
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
