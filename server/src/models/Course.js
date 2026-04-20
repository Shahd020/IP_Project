<<<<<<< HEAD
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
=======
import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * A slug is derived from the title on first save for clean URLs.
 * The text index on title+description powers the course catalog search bar.
 */
const courseSchema = new Schema(
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
<<<<<<< HEAD
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
=======
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },

>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
<<<<<<< HEAD
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
=======
        values: [
          'Web Development',
          'Data Science',
          'Machine Learning',
          'Cyber Security',
          'Cloud Computing',
          'Game Development',
          'Mobile Development',
          'UI/UX Design',
          'Blockchain',
          'Other',
        ],
        message: '{VALUE} is not a supported category',
      },
    },

    /** The institution or organisation offering this course (e.g. "Stanford University"). */
    provider: {
      type: String,
      required: [true, 'Provider is required'],
      trim: true,
      maxlength: [100, 'Provider name cannot exceed 100 characters'],
    },

    /** The instructor who owns and manages this course. */
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Instructor is required'],
    },

    /** Duration expressed as a human-readable string, e.g. "10 weeks". */
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },

    /** Average rating, recalculated via a virtual whenever a new review lands. */
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
<<<<<<< HEAD
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
=======
      set: (v) => Math.round(v * 10) / 10,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    thumbnail: {
      type: String,
      default: '',
    },

    isPublished: {
      type: Boolean,
      default: false,
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

<<<<<<< HEAD
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
=======
// ─── Indexes ──────────────────────────────────────────────────────────────────
courseSchema.index({ title: 'text', description: 'text' }); // full-text search
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ createdAt: -1 });

// ─── Virtuals ─────────────────────────────────────────────────────────────────
/** Exposes the modules sub-collection without embedding them in the document. */
courseSchema.virtual('modules', {
  ref: 'Module',
  localField: '_id',
  foreignField: 'course',
  options: { sort: { order: 1 } },
});

// ─── Hooks ────────────────────────────────────────────────────────────────────
/** Auto-generate URL-safe slug from title on creation. */
courseSchema.pre('save', function generateSlug(next) {
  if (!this.isModified('title')) return next();

  const base = this.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  // Append a short timestamp fragment to guarantee uniqueness on duplicates.
  this.slug = `${base}-${Date.now().toString(36)}`;
  next();
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
