<<<<<<< HEAD
﻿import mongoose from 'mongoose';
=======
<<<<<<< HEAD
// src/models/Module.js
const mongoose = require('mongoose');
>>>>>>> e924226 (phase 2 lilly testing)

const { Schema } = mongoose;

/**
 * A Module is a single lesson/week inside a Course.
 * `order` determines display sequence; the Course virtual sorts by it.
 * The Quiz and ForumPost models both reference Module for scoped queries.
 */
const moduleSchema = new Schema(
  {
<<<<<<< HEAD
=======
=======
﻿import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * A Module is a single lesson/week inside a Course.
 * `order` determines display sequence; the Course virtual sorts by it.
 * The Quiz and ForumPost models both reference Module for scoped queries.
 */
const moduleSchema = new Schema(
  {
>>>>>>> e924226 (phase 2 lilly testing)
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Module must belong to a course'],
    },

<<<<<<< HEAD
=======
>>>>>>> 9e18abd (phase 2 test lilly)
>>>>>>> e924226 (phase 2 lilly testing)
    title: {
      type: String,
      required: [true, 'Module title is required'],
      trim: true,
<<<<<<< HEAD
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },

    /** 1-based position of this module within the course. */
=======
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
>>>>>>> 9e18abd (phase 2 test lilly)
>>>>>>> e924226 (phase 2 lilly testing)
    order: {
      type: Number,
      required: [true, 'Module order is required'],
      min: [1, 'Order must be at least 1'],
    },
<<<<<<< HEAD

    videoUrl: {
=======
<<<<<<< HEAD
    description: {
>>>>>>> e924226 (phase 2 lilly testing)
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

<<<<<<< HEAD
=======
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

>>>>>>> e924226 (phase 2 lilly testing)
moduleSchema.virtual('forumPosts', {
  ref: 'ForumPost',
  localField: '_id',
  foreignField: 'module',
  options: { sort: { createdAt: -1 } },
});

const Module = mongoose.model('Module', moduleSchema);
export default Module;
<<<<<<< HEAD
=======
>>>>>>> 9e18abd (phase 2 test lilly)
>>>>>>> e924226 (phase 2 lilly testing)
