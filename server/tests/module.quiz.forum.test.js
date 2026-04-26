/**
 * Module, Quiz, and Forum critical-path tests
 * Covers: module details, module CRUD, quiz create/get/submit, forum CRUD
 */

import request from 'supertest';
import app from '../src/app.js';
import { USERS, MODULE_PAYLOAD, registerAndLogin, createCourse, enrollStudent, bearer } from './helpers.js';

const QUIZ_PAYLOAD = {
  questions: [
    {
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
    },
    {
      question: 'What colour is the sky on a clear day?',
      options: ['Red', 'Green', 'Blue', 'Yellow'],
      correctAnswer: 2,
    },
  ],
  passingScore: 80,
};

let instructor, student, course, module_;

beforeEach(async () => {
  instructor = await registerAndLogin(USERS.instructor);
  student    = await registerAndLogin(USERS.student);

  course = await createCourse(instructor.accessToken);

  // Add a module to the course
  const modRes = await request(app)
    .post(`/api/courses/${course._id}/modules`)
    .set('Authorization', bearer(instructor.accessToken))
    .send(MODULE_PAYLOAD);
  module_ = modRes.body.data.module;
});

// ─── GET /api/modules/:moduleId/details ──────────────────────────────────────
describe('GET /api/modules/:moduleId/details', () => {
  it('returns module details for an authenticated user', async () => {
    const res = await request(app)
      .get(`/api/modules/${module_._id}/details`)
      .set('Authorization', bearer(student.accessToken));

    expect(res.status).toBe(200);
    expect(res.body.data.module.title).toBe(MODULE_PAYLOAD.title);
  });

  it('returns 401 for unauthenticated requests', async () => {
    const res = await request(app).get(`/api/modules/${module_._id}/details`);
    expect(res.status).toBe(401);
  });

  it('returns 404 for a non-existent module', async () => {
    const res = await request(app)
      .get('/api/modules/000000000000000000000001/details')
      .set('Authorization', bearer(student.accessToken));

    expect(res.status).toBe(404);
  });
});

// ─── PATCH /api/modules/:moduleId ────────────────────────────────────────────
describe('PATCH /api/modules/:moduleId', () => {
  it('instructor can update their own module', async () => {
    const res = await request(app)
      .patch(`/api/modules/${module_._id}`)
      .set('Authorization', bearer(instructor.accessToken))
      .send({ title: 'Updated Module Title' });

    expect(res.status).toBe(200);
    expect(res.body.data.module.title).toBe('Updated Module Title');
  });

  it('returns 403 when a student tries to update a module', async () => {
    const res = await request(app)
      .patch(`/api/modules/${module_._id}`)
      .set('Authorization', bearer(student.accessToken))
      .send({ title: 'Hacked' });

    expect(res.status).toBe(403);
  });
});

// ─── DELETE /api/modules/:moduleId ───────────────────────────────────────────
describe('DELETE /api/modules/:moduleId', () => {
  it('instructor can delete their own module', async () => {
    const res = await request(app)
      .delete(`/api/modules/${module_._id}`)
      .set('Authorization', bearer(instructor.accessToken));

    expect(res.status).toBe(200);
  });

  it('returns 403 when a student tries to delete a module', async () => {
    const res = await request(app)
      .delete(`/api/modules/${module_._id}`)
      .set('Authorization', bearer(student.accessToken));

    expect(res.status).toBe(403);
  });
});

// ─── POST /api/modules/:moduleId/quiz ────────────────────────────────────────
describe('POST /api/modules/:moduleId/quiz', () => {
  it('instructor can create a quiz for their module', async () => {
    const res = await request(app)
      .post(`/api/modules/${module_._id}/quiz`)
      .set('Authorization', bearer(instructor.accessToken))
      .send(QUIZ_PAYLOAD);

    expect(res.status).toBe(201);
    expect(res.body.data.quiz.questions).toHaveLength(2);
  });

  it('returns 403 when a student tries to create a quiz', async () => {
    const res = await request(app)
      .post(`/api/modules/${module_._id}/quiz`)
      .set('Authorization', bearer(student.accessToken))
      .send(QUIZ_PAYLOAD);

    expect(res.status).toBe(403);
  });

  it('returns 400 when questions array is missing', async () => {
    const res = await request(app)
      .post(`/api/modules/${module_._id}/quiz`)
      .set('Authorization', bearer(instructor.accessToken))
      .send({});

    expect(res.status).toBe(400);
  });
});

// ─── GET /api/modules/:moduleId/quiz ─────────────────────────────────────────
describe('GET /api/modules/:moduleId/quiz', () => {
  beforeEach(async () => {
    await request(app)
      .post(`/api/modules/${module_._id}/quiz`)
      .set('Authorization', bearer(instructor.accessToken))
      .send(QUIZ_PAYLOAD);
  });

  it('returns quiz questions without correctAnswer', async () => {
    const res = await request(app)
      .get(`/api/modules/${module_._id}/quiz`)
      .set('Authorization', bearer(student.accessToken));

    expect(res.status).toBe(200);
    expect(res.body.data.quiz.questions[0].correctAnswer).toBeUndefined();
  });

  it('returns 404 when the module has no quiz', async () => {
    // Add a new module with no quiz
    const modRes = await request(app)
      .post(`/api/courses/${course._id}/modules`)
      .set('Authorization', bearer(instructor.accessToken))
      .send({ title: 'No Quiz Module', order: 2 });
    const emptyModule = modRes.body.data.module;

    const res = await request(app)
      .get(`/api/modules/${emptyModule._id}/quiz`)
      .set('Authorization', bearer(student.accessToken));

    expect(res.status).toBe(404);
  });
});

// ─── POST /api/modules/:moduleId/quiz/submit ─────────────────────────────────
describe('POST /api/modules/:moduleId/quiz/submit', () => {
  beforeEach(async () => {
    // Publish the course and enroll the student
    const { default: Course } = await import('../src/models/Course.js');
    await Course.findByIdAndUpdate(course._id, { isPublished: true });
    await enrollStudent(student.accessToken, course._id);

    await request(app)
      .post(`/api/modules/${module_._id}/quiz`)
      .set('Authorization', bearer(instructor.accessToken))
      .send(QUIZ_PAYLOAD);
  });

  it('returns result with passed:true when all answers are correct', async () => {
    // Get the quiz to find real question IDs
    const quizRes = await request(app)
      .get(`/api/modules/${module_._id}/quiz`)
      .set('Authorization', bearer(student.accessToken));
    const questions = quizRes.body.data.quiz.questions;

    // correct answers: Q0 → index 1, Q1 → index 2 (from QUIZ_PAYLOAD)
    const answers = {};
    answers[questions[0]._id] = 1;
    answers[questions[1]._id] = 2;

    const res = await request(app)
      .post(`/api/modules/${module_._id}/quiz/submit`)
      .set('Authorization', bearer(student.accessToken))
      .send({ answers });

    expect(res.status).toBe(200);
    expect(res.body.data.passed).toBe(true);
    expect(res.body.data.percentage).toBe(100);
  });

  it('returns passed:false when too many wrong answers', async () => {
    const quizRes = await request(app)
      .get(`/api/modules/${module_._id}/quiz`)
      .set('Authorization', bearer(student.accessToken));
    const questions = quizRes.body.data.quiz.questions;

    // Both answers wrong
    const answers = {};
    answers[questions[0]._id] = 0;
    answers[questions[1]._id] = 0;

    const res = await request(app)
      .post(`/api/modules/${module_._id}/quiz/submit`)
      .set('Authorization', bearer(student.accessToken))
      .send({ answers });

    expect(res.status).toBe(200);
    expect(res.body.data.passed).toBe(false);
  });

  it('returns 403 when an instructor tries to submit a quiz', async () => {
    const res = await request(app)
      .post(`/api/modules/${module_._id}/quiz/submit`)
      .set('Authorization', bearer(instructor.accessToken))
      .send({ answers: {} });

    expect(res.status).toBe(403);
  });
});

// ─── Forum: GET /api/forum/course/:courseId ───────────────────────────────────
describe('GET /api/forum/course/:courseId', () => {
  it('returns an empty list when no posts exist', async () => {
    const res = await request(app)
      .get(`/api/forum/course/${course._id}`)
      .set('Authorization', bearer(student.accessToken));

    expect(res.status).toBe(200);
    expect(res.body.data.posts).toHaveLength(0);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request(app).get(`/api/forum/course/${course._id}`);
    expect(res.status).toBe(401);
  });
});

// ─── Forum: POST /api/forum/posts ────────────────────────────────────────────
describe('POST /api/forum/posts', () => {
  it('creates a forum post and returns it', async () => {
    const res = await request(app)
      .post('/api/forum/posts')
      .set('Authorization', bearer(student.accessToken))
      .send({ courseId: course._id, text: 'Great course!' });

    expect(res.status).toBe(201);
    expect(res.body.data.post.text).toBe('Great course!');
    expect(res.body.data.post.author).toBeDefined();
  });

  it('returns 400 when text is missing', async () => {
    const res = await request(app)
      .post('/api/forum/posts')
      .set('Authorization', bearer(student.accessToken))
      .send({ courseId: course._id });

    expect(res.status).toBe(400);
  });

  it('returns 400 when courseId is missing', async () => {
    const res = await request(app)
      .post('/api/forum/posts')
      .set('Authorization', bearer(student.accessToken))
      .send({ text: 'Hello' });

    expect(res.status).toBe(400);
  });
});

// ─── Forum: DELETE /api/forum/posts/:postId ──────────────────────────────────
describe('DELETE /api/forum/posts/:postId', () => {
  let postId;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/forum/posts')
      .set('Authorization', bearer(student.accessToken))
      .send({ courseId: course._id, text: 'To be deleted' });
    postId = res.body.data.post._id;
  });

  it('author can soft-delete their own post', async () => {
    const res = await request(app)
      .delete(`/api/forum/posts/${postId}`)
      .set('Authorization', bearer(student.accessToken));

    expect(res.status).toBe(200);
  });

  it('returns 403 when another user tries to delete', async () => {
    const res = await request(app)
      .delete(`/api/forum/posts/${postId}`)
      .set('Authorization', bearer(instructor.accessToken));

    expect(res.status).toBe(403);
  });

  it('returns 404 for a non-existent post', async () => {
    const res = await request(app)
      .delete('/api/forum/posts/000000000000000000000001')
      .set('Authorization', bearer(student.accessToken));

    expect(res.status).toBe(404);
  });
});
