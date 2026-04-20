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
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
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
