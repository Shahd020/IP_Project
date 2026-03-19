# EduPlatform - E-Learning Dashboard

EduPlatform is a comprehensive, responsive e-learning platform built with React and Tailwind CSS. It is designed to provide a premium, interactive learning experience by offering dedicated interfaces for three distinct user roles: Students, Instructors, and Administrators.

## How to Run the Project

To view this project locally on your machine, please follow these steps:

1. **Open your terminal** and navigate to the project directory.
2. **Install the dependencies** by running: npm install
3. **Start the development server** by running: npm run dev

Open your browser and go to the localhost link provided in the terminal (usually http://localhost:5173).

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