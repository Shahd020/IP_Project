// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,       // creates a MongoDB index automatically
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // NEVER returned in queries unless explicitly .select('+password')
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'instructor', 'admin'],
        message: 'Role must be student, instructor, or admin',
      },
      default: 'student',
    },
    avatar: {
      type: String,
      default: null, // URL to profile image
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    // Stores hashed refresh tokens — one per device/session.
    // Array allows a single user to be logged in on multiple devices simultaneously.
    refreshTokens: {
      type: [String],
      select: false, // never leak refresh tokens in API responses
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
// email unique index is created by unique:true above.
// Additional index on role speeds up admin queries like "find all instructors".
userSchema.index({ role: 1 });

// ── Virtuals ──────────────────────────────────────────────────────────────────
// Virtual: number of courses a student is enrolled in (resolved via Enrollment model).
// Not stored in DB — computed on demand.
userSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'student',
});

// Virtual: courses an instructor has created.
userSchema.virtual('createdCourses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'instructor',
});

const User = mongoose.model('User', userSchema);
// Mongoose pluralises 'User' → collection name 'users'

module.exports = User;
