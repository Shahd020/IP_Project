<<<<<<< HEAD
// src/models/Enrollment.js
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Enrollment must belong to a student'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Enrollment must reference a course'],
    },
    // Overall progress 0–100 displayed as the progress bar in StudentCourses.jsx.
    // Recalculated by enrollmentService whenever a module is marked complete.
    progress: {
=======
import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Enrollment is the join table between User (student) and Course.
 * Status mirrors the three tabs in StudentCourses.jsx:
 *   'saved'       → Wishlist / Not Started
 *   'in-progress' → Continue button shown
 *   'completed'   → Review button shown; completedAt is set
 *
 * completedModules tracks granular progress so the frontend can compute
 * progressPercent server-side rather than guessing from dates.
 */
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

    /** 0–100 integer; recomputed by the service layer on every module completion. */
    progressPercent: {
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be negative'],
      max: [100, 'Progress cannot exceed 100'],
    },
<<<<<<< HEAD
    // Array of Module ObjectIds the student has fully completed.
    // Length / total modules count = progress percentage.
    completedModules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
      },
    ],
    status: {
      type: String,
      enum: {
        values: ['active', 'completed', 'dropped'],
        message: 'Status must be active, completed, or dropped',
      },
      default: 'active',
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    // Set by enrollmentService when progress reaches 100
=======

    /** Human-readable label displayed on the progress card, e.g. "Module 4" or "7/10 Weeks". */
    progressText: {
      type: String,
      default: 'Not Started',
      maxlength: [50, 'Progress text too long'],
    },

    /** IDs of modules the student has watched/completed. Avoids N+1 when rendering progress. */
    completedModules: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
      default: [],
    },

    /** Set to true only when the student has passed the quiz for the final module. */
    quizPassed: {
      type: Boolean,
      default: false,
    },

    /** Timestamp of when status transitioned to 'completed'. */
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
    completedAt: {
      type: Date,
      default: null,
    },
  },
<<<<<<< HEAD
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
// Unique compound index: a student can only enroll in a course once.
// Attempting a duplicate insert throws error code 11000 — handled in enrollmentService.
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Single-field indexes for common queries:
// "all courses this student is taking" and "all students in this course"
enrollmentSchema.index({ student: 1 });
enrollmentSchema.index({ course: 1 });

// ── Pre-save hook ─────────────────────────────────────────────────────────────
// Automatically flip status to 'completed' and record completedAt when
// progress reaches 100, so the service layer doesn't need to remember this rule.
enrollmentSchema.pre('save', function (next) {
  if (this.progress === 100 && this.status !== 'completed') {
    this.status = 'completed';
=======
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Unique compound: one enrollment record per student–course pair.
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ student: 1, status: 1 });
enrollmentSchema.index({ course: 1 });

// ─── Hooks ────────────────────────────────────────────────────────────────────
/** Auto-stamp completedAt when the status flips to 'completed'. */
enrollmentSchema.pre('save', function stampCompletion(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
    this.completedAt = new Date();
  }
  next();
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
<<<<<<< HEAD

module.exports = Enrollment;
=======
export default Enrollment;
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
