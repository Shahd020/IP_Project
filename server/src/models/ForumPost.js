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
