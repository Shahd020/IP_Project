import mongoose from 'mongoose';

const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
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

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
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

    provider: {
      type: String,
      required: [true, 'Provider is required'],
      trim: true,
      maxlength: [100, 'Provider name cannot exceed 100 characters'],
    },

    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Instructor is required'],
    },

    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
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
    },

    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },

    level: {
      type: String,
      enum: {
        values: ['beginner', 'intermediate', 'advanced'],
        message: '{VALUE} is not a valid level',
      },
      default: 'beginner',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ createdAt: -1 });

courseSchema.virtual('modules', {
  ref: 'Module',
  localField: '_id',
  foreignField: 'course',
  options: { sort: { order: 1 } },
});

courseSchema.pre('save', function (next) {
  if (!this.isModified('title')) return next();

  const base = this.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  this.slug = `${base}-${Date.now().toString(36)}`;
  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;