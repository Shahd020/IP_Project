const mongoose = require('mongoose');

const { Schema } = mongoose;

const forumPostSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Forum post must belong to a course'],
    },

    module: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
      default: null,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },

    text: {
      type: String,
      required: [true, 'Post text is required'],
      trim: true,
      minlength: [1, 'Post cannot be empty'],
      maxlength: [2000, 'Post cannot exceed 2000 characters'],
    },

    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.__v;
        delete ret.isDeleted;
        return ret;
      },
    },
  }
);

forumPostSchema.index({ course: 1, createdAt: -1 });
forumPostSchema.index({ module: 1, createdAt: -1 });
forumPostSchema.index({ author: 1 });

const ForumPost = mongoose.model('ForumPost', forumPostSchema);

module.exports = ForumPost;