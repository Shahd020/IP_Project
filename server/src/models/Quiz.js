const mongoose = require('mongoose');

const { Schema } = mongoose;

// Question Schema
const questionSchema = new Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
      maxlength: [1000, 'Question text cannot exceed 1000 characters'],
    },

    options: {
      type: [String],
      validate: {
        validator: (arr) => arr.length >= 2 && arr.length <= 6,
        message: 'A question must have between 2 and 6 options',
      },
    },

    correctAnswer: {
      type: Number,
      required: [true, 'Correct answer index is required'],
      min: [0, 'Correct answer index cannot be negative'],
      select: false,
    },

    points: {
      type: Number,
      default: 1,
      min: [1, 'Points must be at least 1'],
    },
  },
  { _id: true }
);

// Quiz Schema
const quizSchema = new Schema(
  {
    module: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
      required: [true, 'Quiz must belong to a module'],
      unique: true,
    },

    questions: {
      type: [questionSchema],
      validate: {
        validator: (arr) => arr.length >= 1,
        message: 'A quiz must have at least one question',
      },
    },

    passingScore: {
      type: Number,
      default: 100,
      min: [1, 'Passing score must be at least 1%'],
      max: [100, 'Passing score cannot exceed 100%'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        if (ret.questions) {
          ret.questions = ret.questions.map(({ correctAnswer, ...q }) => q);
        }
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Grade Method
quizSchema.methods.grade = function (answers) {
  let correct = 0;

  this.questions.forEach((q) => {
    const submitted = answers[q._id.toString()];
    if (submitted !== undefined && submitted === q.correctAnswer) {
      correct++;
    }
  });

  const total = this.questions.length;
  const percentage = Math.round((correct / total) * 100);

  return {
    score: correct,
    total,
    percentage,
    passed: percentage >= this.passingScore,
  };
};

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;