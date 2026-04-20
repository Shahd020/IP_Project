// src/models/Quiz.js
const mongoose = require('mongoose');

// Embedded sub-document for a single question.
const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
      maxlength: [1000, 'Question text cannot exceed 1000 characters'],
    },
    // An array of answer choices shown to the student (min 2, max 6).
    options: {
      type: [String],
      validate: {
        validator: (arr) => arr.length >= 2 && arr.length <= 6,
        message: 'A question must have between 2 and 6 options',
      },
    },
    // Zero-based index into the options array that is the correct answer.
    // Stored server-side only — never sent to the student before submission.
    correctOptionIndex: {
      type: Number,
      required: [true, 'Correct option index is required'],
      min: [0, 'correctOptionIndex cannot be negative'],
    },
    points: {
      type: Number,
      default: 1,
      min: [1, 'Points must be at least 1'],
    },
  },
  { _id: true }
);

// Embedded sub-document recording one student's attempt at a quiz.
const attemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Raw score (sum of points for correct answers)
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    // Percentage 0–100 compared against passingScore
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    // The index each student selected for each question, in order.
    // Used to show "your answer was X, correct was Y" on the results screen.
    answers: {
      type: [Number],
      default: [],
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Quiz must belong to a course'],
    },
    // Optional: a quiz can be linked to a specific module OR to the whole course
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
      maxlength: [150, 'Quiz title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (arr) => arr.length >= 1,
        message: 'A quiz must have at least one question',
      },
    },
    // Minimum percentage (0–100) required to pass the quiz
    passingScore: {
      type: Number,
      default: 70,
      min: [0, 'Passing score cannot be negative'],
      max: [100, 'Passing score cannot exceed 100'],
    },
    // Optional time limit in minutes (null = unlimited)
    timeLimit: {
      type: Number,
      min: [1, 'Time limit must be at least 1 minute'],
      default: null,
    },
    // All student attempts are stored here.
    // Stored embedded for fast retrieval of "did this student pass?" without
    // a separate collection join on every course-study page load.
    attempts: {
      type: [attemptSchema],
      default: [],
      select: false, // exclude by default; load explicitly when needed
    },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
quizSchema.index({ course: 1 });
quizSchema.index({ module: 1 });

// ── Instance method ───────────────────────────────────────────────────────────
/**
 * Grades a submitted answer array against the stored correct answers.
 * Returns { score, percentage, passed, answers }.
 * Called by quizService — keeps grading logic co-located with the schema.
 *
 * @param {number[]} submittedAnswers - Zero-based option index per question
 * @returns {{ score: number, percentage: number, passed: boolean, answers: number[] }}
 */
quizSchema.methods.gradeAttempt = function (submittedAnswers) {
  let score = 0;
  const totalPoints = this.questions.reduce((sum, q) => sum + q.points, 0);

  this.questions.forEach((question, i) => {
    if (submittedAnswers[i] === question.correctOptionIndex) {
      score += question.points;
    }
  });

  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

  return {
    score,
    percentage,
    passed: percentage >= this.passingScore,
    answers: submittedAnswers,
  };
};

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
