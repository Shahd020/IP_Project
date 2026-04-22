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
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be negative'],
      max: [100, 'Progress cannot exceed 100'],
    },
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
    completedAt: {
      type: Date,
      default: null,
    },
  },
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
    this.completedAt = new Date();
  }
  next();
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
