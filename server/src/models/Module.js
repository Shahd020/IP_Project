<<<<<<< HEAD
// src/models/Module.js
const mongoose = require('mongoose');

// Embedded sub-document schema for individual content items inside a module.
// Embedded because content items have no identity outside their parent module.
const contentItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Content type is required'],
      enum: {
        values: ['video', 'pdf', 'text', 'link'],
        message: 'Content type must be video, pdf, text, or link',
      },
    },
    title: {
      type: String,
      required: [true, 'Content title is required'],
      trim: true,
      maxlength: [200, 'Content title cannot exceed 200 characters'],
    },
    // url is used for video, pdf, and link types
    url: {
      type: String,
      default: null,
    },
    // body is used for text/markdown content rendered inline
    body: {
      type: String,
      default: null,
    },
    // duration in minutes — used for video items to show estimated watch time
    duration: {
      type: Number,
      min: [0, 'Duration cannot be negative'],
      default: 0,
    },
  },
  { _id: true } // each content item gets its own _id for progress tracking
);

const moduleSchema = new mongoose.Schema(
  {
=======
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

>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
    title: {
      type: String,
      required: [true, 'Module title is required'],
      trim: true,
<<<<<<< HEAD
      minlength: [2, 'Module title must be at least 2 characters'],
      maxlength: [150, 'Module title cannot exceed 150 characters'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Module must belong to a course'],
    },
    // order determines the sequence within a course (1, 2, 3 …).
    // The unique compound index below ensures no two modules share the same
    // position within the same course.
=======
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },

    /** 1-based position of this module within the course. */
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
    order: {
      type: Number,
      required: [true, 'Module order is required'],
      min: [1, 'Order must be at least 1'],
    },
<<<<<<< HEAD
    description: {
      type: String,
      maxlength: [500, 'Module description cannot exceed 500 characters'],
      default: '',
    },
    content: {
      type: [contentItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
// Unique compound index: a course cannot have two modules at the same position.
moduleSchema.index({ course: 1, order: 1 }, { unique: true });

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
=======

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

    /** Total video length in seconds — used to compute estimated watch time. */
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

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Compound unique index: a course cannot have two modules at the same position.
moduleSchema.index({ course: 1, order: 1 }, { unique: true });

// ─── Virtuals ─────────────────────────────────────────────────────────────────
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
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
