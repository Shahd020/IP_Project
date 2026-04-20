import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Each Module has at most one Quiz (enforced by the unique index).
 * correctAnswer stores the 0-based index into the options array.
 * `select: false` on correctAnswer prevents it from being sent to the
 * client during a quiz attempt — the service only returns it after submission.
 */
const questionSchema = new Schema(
  {
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
      minlength: [5, 'Question must be at least 5 characters'],
      maxlength: [500, 'Question cannot exceed 500 characters'],
    },

    options: {
      type: [String],
      validate: {
        validator: (arr) => arr.length >= 2 && arr.length <= 6,
        message: 'A question must have between 2 and 6 options',
      },
    },

    /** 0-based index of the correct option. Hidden from clients during attempt. */
    correctAnswer: {
      type: Number,
      required: [true, 'Correct answer index is required'],
      min: [0, 'Correct answer index cannot be negative'],
      select: false,
    },
  },
  { _id: true }
);

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

    /**
     * Minimum percentage of correct answers to pass.
     * The CourseStudy UI currently requires 100%; stored here so
     * instructors can lower it per quiz in the future.
     */
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
        // Strip correctAnswer from every question before the document is
        // serialised — the submit endpoint re-fetches with +correctAnswer.
        if (ret.questions) {
          ret.questions = ret.questions.map(({ correctAnswer: _ca, ...q }) => q);
        }
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// ─── Instance Methods ─────────────────────────────────────────────────────────
/**
 * Grade a submitted answer map and return score details.
 * Must be called on a document fetched with `.select('+questions.correctAnswer')`.
 *
 * @param {Record<string, number>} answers - { questionId: selectedOptionIndex }
 * @returns {{ score: number, total: number, passed: boolean }}
 */
quizSchema.methods.grade = function grade(answers) {
  let correct = 0;

  this.questions.forEach((q) => {
    const submitted = answers[q._id.toString()];
    if (submitted !== undefined && submitted === q.correctAnswer) {
      correct += 1;
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
export default Quiz;
