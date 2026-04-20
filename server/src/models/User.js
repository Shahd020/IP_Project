<<<<<<< HEAD
// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
=======
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

/**
 * Stores hashed passwords — plaintext is never persisted.
 * refreshTokens array enables multi-device logout and token rotation.
 * `select: false` on password/refreshTokens prevents them leaking into
 * query results unless explicitly requested with .select('+password').
 */
const userSchema = new Schema(
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
<<<<<<< HEAD
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,       // creates a MongoDB index automatically
=======

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
<<<<<<< HEAD
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // NEVER returned in queries unless explicitly .select('+password')
    },
=======

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },

>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
    role: {
      type: String,
      enum: {
        values: ['student', 'instructor', 'admin'],
        message: 'Role must be student, instructor, or admin',
      },
      default: 'student',
    },
<<<<<<< HEAD
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
=======

    avatar: {
      type: String,
      default: '',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    /** Array of valid refresh tokens for this user (supports multi-device). */
    refreshTokens: {
      type: [String],
      select: false,
      default: [],
    },
  },
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
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// ─── Hooks ────────────────────────────────────────────────────────────────────
/** Hash password before any save that touches it. */
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance Methods ─────────────────────────────────────────────────────────
/**
 * Compare a plaintext candidate against the stored bcrypt hash.
 * @param {string} candidate - The password supplied by the user at login.
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

/** Remove a specific refresh token (logout from one device). */
userSchema.methods.revokeRefreshToken = function revokeRefreshToken(token) {
  this.refreshTokens = this.refreshTokens.filter((t) => t !== token);
  return this.save();
};

/** Remove all refresh tokens (logout from all devices). */
userSchema.methods.revokeAllRefreshTokens = function revokeAllRefreshTokens() {
  this.refreshTokens = [];
  return this.save();
};

const User = mongoose.model('User', userSchema);
export default User;
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
