# Phase 2 Project Specification

## Scope

EduPlatform is now a full-stack e-learning platform with React, Node.js, Express, MongoDB, Mongoose, JWT authentication, role-based authorization, and cloud deployment configuration.

Phase 2 improvements:

- Replaced static frontend data flows with API-backed auth, courses, modules, enrollments, users, quizzes, and forum data.
- Added schema-level validation and relationships with Mongoose.
- Added protected routes for student, instructor, and admin workflows.
- Added deployment files for Vercel frontend hosting and Render backend hosting.

## Database Design

### User

Collection: `users`

Fields: `name`, `email`, `password`, `role`, `avatar`, `isActive`, `refreshTokens`, timestamps.

Relationships:

- One instructor can create many courses.
- One student can have many enrollments.
- Users author forum posts.

### Course

Collection: `courses`

Fields: `title`, `description`, `category`, `provider`, `duration`, `thumbnail`, `instructor`, `isPublished`, `rating`, `totalRatings`, `enrollmentCount`, timestamps.

Relationships:

- Belongs to one instructor.
- Has many modules.
- Has many enrollments.

### Module

Collection: `modules`

Fields: `course`, `title`, `description`, `order`, `videoUrl`, `content`, timestamps.

Relationships:

- Belongs to one course.
- Can have one quiz.
- Can have forum posts.

### Enrollment

Collection: `enrollments`

Fields: `student`, `course`, `status`, `progressPercent`, `progressText`, `completedModules`, timestamps.

Relationships:

- Joins students to courses.
- Tracks progress against course modules.

### Quiz

Collection: `quizzes`

Fields: `module`, `questions`, `passingScore`, timestamps.

Relationships:

- Belongs to one module.
- Submission is graded server-side.

### ForumPost

Collection: `forumposts`

Fields: `course`, `module`, `author`, `text`, `isDeleted`, timestamps.

Relationships:

- Belongs to a course and optionally a module.
- Belongs to one author.

## API Endpoints

Base path: `/api`

### Auth

- `POST /auth/register` creates a user. Body: `name`, `email`, `password`, optional `role`. Returns user and access token; sets refresh cookie.
- `POST /auth/login` logs in. Body: `email`, `password`. Returns user and access token; sets refresh cookie.
- `POST /auth/refresh` rotates tokens using the HttpOnly refresh cookie.
- `POST /auth/logout` revokes the current refresh token.
- `GET /auth/me` returns the authenticated user.

### Courses

- `GET /courses` lists published courses. Query: `page`, `limit`, `search`, `category`.
- `GET /courses/instructor/my` lists courses owned by the instructor.
- `GET /courses/:id` returns one course with details.
- `POST /courses` creates a course. Roles: instructor, admin.
- `PATCH /courses/:id` updates a course. Roles: owner instructor, admin.
- `DELETE /courses/:id` deletes a course. Roles: owner instructor, admin.
- `GET /courses/:courseId/modules` lists modules for a course.
- `POST /courses/:courseId/modules` creates a module. Roles: instructor, admin.

### Modules And Quizzes

- `GET /modules/:moduleId/details` returns module, quiz, and forum context.
- `PATCH /modules/:moduleId` updates a module. Roles: instructor, admin.
- `DELETE /modules/:moduleId` deletes a module. Roles: instructor, admin.
- `GET /modules/:moduleId/quiz` returns quiz questions without answers.
- `POST /modules/:moduleId/quiz` creates or replaces a quiz. Roles: instructor, admin.
- `POST /modules/:moduleId/quiz/submit` grades a student submission.

### Enrollments

- `GET /enrollments/my` returns the current student's enrollments. Query: optional `status`.
- `GET /enrollments/course/:courseId` returns enrollments for an instructor-owned course.
- `POST /enrollments` enrolls or saves a course. Body: `courseId`, optional `status`.
- `PATCH /enrollments/:id/progress` marks a module complete. Body: `moduleId`, optional `progressText`.
- `DELETE /enrollments/:id` removes an enrollment or saved course.

### Users

- `GET /users` lists users. Role: admin.
- `GET /users/:id` returns one user.
- `PATCH /users/:id` updates a user.
- `PATCH /users/:id/toggle-active` activates or deactivates a user. Role: admin.
- `DELETE /users/:id` deletes a user. Role: admin.

### Forum

- `GET /forum/course/:courseId` lists course posts.
- `GET /forum/module/:moduleId` lists module posts.
- `POST /forum/posts` creates a post. Body: `courseId`, optional `moduleId`, `text`.
- `DELETE /forum/posts/:postId` soft-deletes a post.

## Cloud Hosting

Frontend: Vercel.

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-render-api.onrender.com/api`

Backend: Render.

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Health check: `/api/health`
- Required variables: `MONGODB_URI`, `CLIENT_ORIGIN`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`

MongoDB: MongoDB Atlas.

- Use Atlas connection string as `MONGODB_URI`.
- Add Render outbound access to Atlas network settings, or temporarily allow `0.0.0.0/0` for academic demos.
