# EduPlatform - E-Learning Dashboard

EduPlatform is a comprehensive, responsive e-learning platform built with React and Tailwind CSS. It is designed to provide a premium, interactive learning experience by offering dedicated interfaces for three distinct user roles: Students, Instructors, and Administrators.

## How to Run the Project

To view this project locally on your machine, please follow these steps:

1. **Open your terminal** and navigate to the project directory.
2. **Install frontend dependencies** by running: `npm install`
3. **Install backend dependencies** by running: `cd server && npm install`
4. **Create environment files** from `.env.example` and `server/.env.example`
5. **Start the backend** from `server` by running: `npm run dev`
6. **Start the frontend** from the project root by running: `npm run dev`

Open your browser and go to the localhost link provided in the terminal (usually http://localhost:5173).

## Cloud Hosting

This repository is ready for separate frontend and backend hosting.

- Frontend: deploy the project root to Vercel. Set `VITE_API_URL` to your backend URL, for example `https://your-render-api.onrender.com/api`.
- Backend: deploy the `server` folder to Render. Use `npm install` as the build command and `npm start` as the start command.
- Database: create a MongoDB Atlas cluster and set the Render `MONGODB_URI` environment variable.
- CORS: set Render `CLIENT_ORIGIN` to your Vercel frontend URL.
- Secrets: set `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in Render to long random values.

See `docs/PHASE_2_SPECIFICATION.md` for the database design, API routes, and Phase 2 scope.

**Key Features to Review**
This project goes beyond a standard static layout by implementing complex routing and role-based views. When grading, please be sure to test the following features:

1. Three Distinct Role-Based Dashboards
The platform routes users to completely different layouts depending on their role. You can test this by clicking "Login" and selecting a role from the dropdown menu:

Student View (/student/courses): Features a dark-themed course catalog, progress tracking, interactive study modes, and flashcards.

Instructor View (/instructor/dashboard): Includes tools for course creation, managing modules, and building quizzes.

Admin View (/admin/users): Contains data tables for user management, analytics, and platform settings.

2. Premium UI/UX Design
Modern Dark Theme: Styled extensively with Tailwind CSS, utilizing deep indigo and blue gradients, glowing accents, and glass-morphism effects.

Interactive Animations: Features a complex sliding dual-panel login screen, smooth hover states on course cards, and dynamic charting components.

Responsive Architecture: The grid layouts and flex containers are built to handle various screen sizes gracefully.

3. Dynamic Public Course Catalog
Master Catalog (/catalog): A public-facing marketplace for browsing available courses.

Dynamic Details (/course/:courseId): Clicking a course generates a detailed overview page (syllabus, pricing, and preview) specific to that topic.

 **Technologies Used**
React (Hooks, State Management)

React Router DOM (Complex multi-path routing and protected layouts)

Tailwind CSS (Utility-first styling and custom animations)

Recharts (Data visualization in dashboards)

Lucide React (Vector iconography)
