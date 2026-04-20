/**
 * Database seeder — run with:  node src/seeder.js
 * Creates demo users, courses, modules, and enrollments.
 * Safe to re-run: drops all seeded collections first.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const User       = require('./models/User');
const Course     = require('./models/Course');
const Module     = require('./models/Module');
const Enrollment = require('./models/Enrollment');

// ── Seed data ─────────────────────────────────────────────────────────────────

const USERS = [
  { name: 'Admin User',       email: 'admin@edu.com',      password: 'Admin1234!',    role: 'admin' },
  { name: 'Alice Instructor', email: 'alice@edu.com',       password: 'Instructor1!',  role: 'instructor' },
  { name: 'Bob Instructor',   email: 'bob@edu.com',         password: 'Instructor2!',  role: 'instructor' },
  { name: 'Student One',      email: 'student1@edu.com',    password: 'Student123!',   role: 'student' },
  { name: 'Student Two',      email: 'student2@edu.com',    password: 'Student123!',   role: 'student' },
];

const makeCourses = (instructorIds) => [
  {
    title: 'Web Development Bootcamp',
    description: 'Build responsive websites with HTML, CSS, JavaScript, and React from scratch.',
    category: 'Technology',
    level: 'beginner',
    price: 89.99,
    duration: '10 weeks',
    status: 'published',
    rating: 4.8,
    totalRatings: 312,
    enrollmentCount: 0,
    instructor: instructorIds[0],
    learningOutcomes: [
      'Build semantic HTML layouts',
      'Style with Tailwind CSS',
      'Write modern ES6+ JavaScript',
      'Create React component hierarchies',
    ],
  },
  {
    title: 'Machine Learning Essentials',
    description: 'Learn supervised learning, neural networks, and model evaluation from first principles.',
    category: 'Data Science',
    level: 'intermediate',
    price: 129.99,
    duration: '12 weeks',
    status: 'published',
    rating: 4.9,
    totalRatings: 540,
    enrollmentCount: 0,
    instructor: instructorIds[1],
    learningOutcomes: [
      'Understand bias–variance tradeoff',
      'Train and evaluate classification models',
      'Build a simple neural network in PyTorch',
      'Deploy a model as a REST API',
    ],
  },
  {
    title: 'Internet Programming with React',
    description: 'Master React hooks, routing, context, and integration with REST APIs.',
    category: 'Technology',
    level: 'intermediate',
    price: 119.99,
    duration: '12 weeks',
    status: 'published',
    rating: 4.8,
    totalRatings: 820,
    enrollmentCount: 0,
    instructor: instructorIds[0],
    learningOutcomes: [
      'Use useState, useEffect, and useContext',
      'Implement client-side routing',
      'Authenticate users with JWT',
      'Deploy to Vercel',
    ],
  },
  {
    title: 'Entrepreneurship Fundamentals',
    description: 'Turn an idea into a viable business: market research, MVP, and fundraising basics.',
    category: 'Business',
    level: 'beginner',
    price: 69.99,
    duration: '6 weeks',
    status: 'published',
    rating: 4.6,
    totalRatings: 180,
    enrollmentCount: 0,
    instructor: instructorIds[1],
    learningOutcomes: [
      'Validate product-market fit',
      'Write a lean business plan',
      'Build a pitch deck',
      'Understand seed-stage funding',
    ],
  },
  {
    title: 'UX/UI Design Principles',
    description: 'Learn design thinking, wireframing, and prototyping with Figma.',
    category: 'Design',
    level: 'beginner',
    price: 79.99,
    duration: '8 weeks',
    status: 'draft',
    rating: 0,
    totalRatings: 0,
    enrollmentCount: 0,
    instructor: instructorIds[0],
    learningOutcomes: [
      'Apply the design-thinking process',
      'Create low and high-fidelity wireframes',
      'Conduct usability tests',
    ],
  },
];

const makeModules = (courseId, courseName) => [
  {
    course: courseId,
    title: `${courseName} — Introduction`,
    description: 'Overview, tooling setup, and course roadmap.',
    order: 1,
    content: [
      { type: 'video', title: 'Welcome & Course Overview', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: 8 },
      { type: 'pdf',   title: 'Course Syllabus', url: 'https://example.com/syllabus.pdf' },
    ],
  },
  {
    course: courseId,
    title: `${courseName} — Core Concepts`,
    description: 'Foundational theory and practical exercises.',
    order: 2,
    content: [
      { type: 'video', title: 'Core Concepts Explained', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', duration: 22 },
      { type: 'text',  title: 'Reading Notes', body: 'This module covers the fundamental concepts you will use throughout the course.' },
    ],
  },
  {
    course: courseId,
    title: `${courseName} — Hands-on Project`,
    description: 'Apply everything learned in a real-world mini project.',
    order: 3,
    content: [
      { type: 'video', title: 'Project Walkthrough', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', duration: 35 },
      { type: 'link',  title: 'Starter Repository', url: 'https://github.com' },
    ],
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { maxPoolSize: 10 });
    console.log('Connected to MongoDB');

    // Wipe existing seed data
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Module.deleteMany({}),
      Enrollment.deleteMany({}),
    ]);
    console.log('Collections cleared');

    // Create users (password hashing handled by the pre-save hook)
    const createdUsers = await User.create(USERS);
    console.log(`Created ${createdUsers.length} users`);

    const instructors = createdUsers.filter((u) => u.role === 'instructor');
    const students    = createdUsers.filter((u) => u.role === 'student');
    const instructorIds = instructors.map((i) => i._id);

    // Create courses
    const createdCourses = await Course.create(makeCourses(instructorIds));
    console.log(`Created ${createdCourses.length} courses`);

    // Create modules for each course
    const modulePromises = createdCourses.map((course) =>
      Module.create(makeModules(course._id, course.title))
    );
    const allModuleGroups = await Promise.all(modulePromises);
    console.log(`Created ${allModuleGroups.flat().length} modules`);

    // Link module IDs back to their courses
    await Promise.all(
      createdCourses.map((course, i) =>
        Course.findByIdAndUpdate(course._id, {
          modules: allModuleGroups[i].map((m) => m._id),
        })
      )
    );

    // Enroll students in the first two published courses
    const publishedCourses = createdCourses.filter((c) => c.status === 'published');
    const enrollments = [];
    for (const student of students) {
      for (const course of publishedCourses.slice(0, 2)) {
        enrollments.push({ student: student._id, course: course._id, status: 'active', progress: 0 });
      }
    }
    await Enrollment.create(enrollments);

    // Update enrollmentCount on enrolled courses
    await Promise.all(
      publishedCourses.slice(0, 2).map((c) =>
        Course.findByIdAndUpdate(c._id, { enrollmentCount: students.length })
      )
    );
    console.log(`Created ${enrollments.length} enrollments`);

    console.log('\n── Seed complete ──────────────────────────────');
    console.log('Admin:      admin@edu.com       / Admin1234!');
    console.log('Instructor: alice@edu.com        / Instructor1!');
    console.log('Instructor: bob@edu.com          / Instructor2!');
    console.log('Student:    student1@edu.com     / Student123!');
    console.log('Student:    student2@edu.com     / Student123!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeder failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
