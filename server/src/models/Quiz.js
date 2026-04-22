<<<<<<< HEAD
﻿import mongoose from 'mongoose';
=======
<<<<<<< HEAD
// src/models/Quiz.js
const mongoose = require('mongoose');
>>>>>>> e924226 (phase 2 lilly testing)

const { Schema } = mongoose;

/**
 * Each Module has at most one Quiz (enforced by the unique index).
 * correctAnswer stores the 0-based index into the options array.
 * `select: false` on correctAnswer prevents it from being sent to the
 * client during a quiz attempt â€” the service only returns it after submission.
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
<<<<<<< HEAD

=======
    // An array of answer choices shown to the student (min 2, max 6).
=======
﻿import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Each Module has at most one Quiz (enforced by the unique index).
 * correctAnswer stores the 0-based index into the options array.
 * `select: false` on correctAnswer prevents it from being sent to the
 * client during a quiz attempt â€” the service only returns it after submission.
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

>>>>>>> 9e18abd (phase 2 test lilly)
>>>>>>> e924226 (phase 2 lilly testing)
    options: {
      type: [String],
      validate: {
        validator: (arr) => arr.length >= 2 && arr.length <= 6,
        message: 'A question must have between 2 and 6 options',
      },
    },
<<<<<<< HEAD

    /** 0-based index of the correct option. Hidden from clients during attempt. */
    correctAnswer: {
      type: Number,
      required: [true, 'Correct answer index is required'],
      min: [0, 'Correct answer index cannot be negative'],
      select: false,
=======
<<<<<<< HEAD
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
=======

    /** 0-based index of the correct option. Hidden from clients during attempt. */
    correctAnswer: {
      type: Number,
      required: [true, 'Correct answer index is required'],
      min: [0, 'Correct answer index cannot be negative'],
      select: false,
>>>>>>> 9e18abd (phase 2 test lilly)
>>>>>>> e924226 (phase 2 lilly testing)
    },
  },
  { _id: true }
);

<<<<<<< HEAD
const quizSchema = new Schema(
=======
<<<<<<< HEAD
// Embedded sub-document recording one student's attempt at a quiz.
const attemptSchema = new mongoose.Schema(
>>>>>>> e924226 (phase 2 lilly testing)
  {
    module: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
      required: [true, 'Quiz must belong to a module'],
      unique: true,
    },
<<<<<<< HEAD

=======
=======
const quizSchema = new Schema(
  {
    module: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
      required: [true, 'Quiz must belong to a module'],
      unique: true,
    },

>>>>>>> 9e18abd (phase 2 test lilly)
>>>>>>> e924226 (phase 2 lilly testing)
    questions: {
      type: [questionSchema],
      validate: {
        validator: (arr) => arr.length >= 1,
        message: 'A quiz must have at least one question',
      },
    },
<<<<<<< HEAD

    /**
     * Minimum percentage of correct answers to pass.
     * The CourseStudy UI currently requires 100%; stored here so
     * instructors can lower it per quiz in the future.
     */
=======
<<<<<<< HEAD
    // Minimum percentage (0–100) required to pass the quiz
>>>>>>> e924226 (phase 2 lilly testing)
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
        // serialised â€” the submit endpoint re-fetches with +correctAnswer.
        if (ret.questions) {
          ret.questions = ret.questions.map(({ correctAnswer: _ca, ...q }) => q);
        }
        delete ret.__v;
        return ret;
      },
    },
  }
);

// â”€â”€â”€ Indexes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// â”€â”€â”€ Instance Methods â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
<<<<<<< HEAD
=======
    answers: submittedAnswers,
=======

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
        // serialised â€” the submit endpoint re-fetches with +correctAnswer.
        if (ret.questions) {
          ret.questions = ret.questions.map(({ correctAnswer: _ca, ...q }) => q);
        }
        delete ret.__v;
        return ret;
      },
    },
  }
);

// â”€â”€â”€ Indexes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// â”€â”€â”€ Instance Methods â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
>>>>>>> 9e18abd (phase 2 test lilly)
>>>>>>> e924226 (phase 2 lilly testing)
  };
};

const Quiz = mongoose.model('Quiz', quizSchema);
<<<<<<< HEAD
export default Quiz;
=======
<<<<<<< HEAD

module.exports = Quiz;
=======
export default Quiz;
>>>>>>> 9e18abd (phase 2 test lilly)
>>>>>>> e924226 (phase 2 lilly testing)
