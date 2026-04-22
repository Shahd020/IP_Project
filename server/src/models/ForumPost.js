// src/models/ForumPost.js
const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Forum post must belong to a course'],
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Forum post must have an author'],
    },
    text: {
      type: String,
      required: [true, 'Post text is required'],
      maxlength: [5000, 'Post cannot exceed 5000 characters'],
      trim: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

forumPostSchema.index({ course: 1, createdAt: -1 });
forumPostSchema.index({ module: 1, createdAt: -1 });
forumPostSchema.index({ author: 1 });

module.exports = mongoose.model('ForumPost', forumPostSchema);
