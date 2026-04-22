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
    title: {
      type: String,
      required: [true, 'Module title is required'],
      trim: true,
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
    order: {
      type: Number,
      required: [true, 'Module order is required'],
      min: [1, 'Order must be at least 1'],
    },
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
