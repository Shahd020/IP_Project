// src/models/Course.js
const mongoose = require('mongoose');

// Categories match your existing Categories.jsx data exactly
const CATEGORIES = [
  'Technology',
  'Business',
  'Design',
  'Data Science',
  'Health & Fitness',
  'Languages',
];

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Course must have an instructor'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: `Category must be one of: ${CATEGORIES.join(', ')}`,
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    thumbnail: {
      type: String,
      default: null, // URL to cover image
    },
    level: {
      type: String,
      required: [true, 'Level is required'],
      enum: {
        values: ['beginner', 'intermediate', 'advanced'],
        message: 'Level must be beginner, intermediate, or advanced',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published', 'archived'],
        message: 'Status must be draft, published, or archived',
      },
      default: 'draft',
    },
    // Denormalized aggregates — updated by the enrollmentService and review logic.
    // Storing them here avoids a COUNT query every time the catalog is loaded.
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String, // e.g. "12 hours" — set by instructor, not calculated
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    // References to Module documents (ordered list).
    // Using refs instead of embedding keeps document size small and lets us
    // load modules individually for large courses without fetching everything.
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
      },
    ],
    // Learning outcomes shown on the course overview page (CourseCatalog.jsx)
    learningOutcomes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
courseSchema.index({ instructor: 1 });          // "my courses" instructor dashboard
courseSchema.index({ category: 1, status: 1 }); // catalog filtering
courseSchema.index({ status: 1, rating: -1 });  // "top rated published courses"
courseSchema.index({ title: 'text', description: 'text' }); // full-text search

// ── Virtuals ──────────────────────────────────────────────────────────────────
// Virtual: live count of active enrollments (not stored, queried via populate)
courseSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'course',
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
