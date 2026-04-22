<<<<<<< HEAD
﻿import mongoose from 'mongoose';
=======
<<<<<<< HEAD
// src/models/Enrollment.js
const mongoose = require('mongoose');
>>>>>>> e924226 (phase 2 lilly testing)

const { Schema } = mongoose;

/**
 * Enrollment is the join table between User (student) and Course.
 * Status mirrors the three tabs in StudentCourses.jsx:
 *   'saved'       â†’ Wishlist / Not Started
 *   'in-progress' â†’ Continue button shown
 *   'completed'   â†’ Review button shown; completedAt is set
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
<<<<<<< HEAD
=======
    // Overall progress 0–100 displayed as the progress bar in StudentCourses.jsx.
    // Recalculated by enrollmentService whenever a module is marked complete.
    progress: {
=======
﻿import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Enrollment is the join table between User (student) and Course.
 * Status mirrors the three tabs in StudentCourses.jsx:
 *   'saved'       â†’ Wishlist / Not Started
 *   'in-progress' â†’ Continue button shown
 *   'completed'   â†’ Review button shown; completedAt is set
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
>>>>>>> e924226 (phase 2 lilly testing)

    status: {
      type: String,
      enum: {
        values: ['saved', 'in-progress', 'completed'],
        message: 'Status must be saved, in-progress, or completed',
      },
      default: 'saved',
    },

    /** 0â€“100 integer; recomputed by the service layer on every module completion. */
    progressPercent: {
<<<<<<< HEAD
=======
>>>>>>> 9e18abd (phase 2 test lilly)
>>>>>>> e924226 (phase 2 lilly testing)
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be negative'],
      max: [100, 'Progress cannot exceed 100'],
    },
<<<<<<< HEAD

    /** Human-readable label displayed on the progress card, e.g. "Module 4" or "7/10 Weeks". */
    progressText: {
=======
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
>>>>>>> e924226 (phase 2 lilly testing)
      type: String,
      default: 'Not Started',
      maxlength: [50, 'Progress text too long'],
    },

    /** IDs of modules the student has watched/completed. Avoids N+1 when rendering progress. */
    completedModules: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
      default: [],
    },
<<<<<<< HEAD
=======
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
>>>>>>> e924226 (phase 2 lilly testing)

    /** Set to true only when the student has passed the quiz for the final module. */
    quizPassed: {
      type: Boolean,
      default: false,
    },

    /** Timestamp of when status transitioned to 'completed'. */
<<<<<<< HEAD
=======
>>>>>>> 9e18abd (phase 2 test lilly)
>>>>>>> e924226 (phase 2 lilly testing)
    completedAt: {
      type: Date,
      default: null,
    },
  },
<<<<<<< HEAD
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
=======
<<<<<<< HEAD
  { timestamps: true }
>>>>>>> e924226 (phase 2 lilly testing)
);

// â”€â”€â”€ Indexes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Unique compound: one enrollment record per studentâ€“course pair.
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ student: 1, status: 1 });
enrollmentSchema.index({ course: 1 });

<<<<<<< HEAD
=======
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

// â”€â”€â”€ Indexes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Unique compound: one enrollment record per studentâ€“course pair.
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ student: 1, status: 1 });
enrollmentSchema.index({ course: 1 });

>>>>>>> e924226 (phase 2 lilly testing)
// â”€â”€â”€ Hooks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/** Auto-stamp completedAt when the status flips to 'completed'. */
enrollmentSchema.pre('save', function stampCompletion(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
<<<<<<< HEAD
=======
>>>>>>> 9e18abd (phase 2 test lilly)
>>>>>>> e924226 (phase 2 lilly testing)
    this.completedAt = new Date();
  }
  next();
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
<<<<<<< HEAD
export default Enrollment;
=======
<<<<<<< HEAD

module.exports = Enrollment;
=======
export default Enrollment;
>>>>>>> 9e18abd (phase 2 test lilly)
>>>>>>> e924226 (phase 2 lilly testing)
