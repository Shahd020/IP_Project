/**
 * Seed script — creates a consistent demo dataset every run.
 * Run with: npm run seed (from server/ directory)
 *
 * Creates: 5 users, 5 courses (4 published + 1 draft),
 * 14 modules, 14 quizzes with 5 questions each (80% passing),
 * and 4 enrollments (2 students × 2 courses each).
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Course from './models/Course.js';
import Module from './models/Module.js';
import Quiz from './models/Quiz.js';
import Enrollment from './models/Enrollment.js';
import ForumPost from './models/ForumPost.js';

const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb://localhost:27017/elearning';

// Free publicly accessible MP4 files from Google — work in HTML <video>
const VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.info('Connected to MongoDB');

    // ── Clear all collections ─────────────────────────────────────────────────
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Module.deleteMany({}),
      Quiz.deleteMany({}),
      Enrollment.deleteMany({}),
      ForumPost.deleteMany({}),
    ]);
    console.info('Collections cleared');

    // ── Users ─────────────────────────────────────────────────────────────────
    // Passwords are hashed by User.pre('save')
    const users = await User.create([
      { name: 'Admin User',     email: 'admin@edu.com',    password: 'Admin1234!',    role: 'admin' },
      { name: 'Alice Chen',     email: 'alice@edu.com',    password: 'Instructor1!',  role: 'instructor' },
      { name: 'Bob Martinez',   email: 'bob@edu.com',      password: 'Instructor2!',  role: 'instructor' },
      { name: 'Sarah Johnson',  email: 'student1@edu.com', password: 'Student123!',   role: 'student' },
      { name: 'Mike Wilson',    email: 'student2@edu.com', password: 'Student123!',   role: 'student' },
    ]);
    console.info(`Created ${users.length} users`);

    const [, alice, bob, sarah, mike] = users;

    // ── Courses ───────────────────────────────────────────────────────────────
    const courses = await Course.create([
      {
        title: 'Full-Stack Web Development Bootcamp',
        description:
          'Master modern web development from HTML/CSS foundations through React and Node.js backends. ' +
          'Build and deploy three real-world projects. Covers responsive design, REST APIs, ' +
          'authentication, and cloud deployment on Vercel. Perfect for beginners and career-changers ' +
          'who want to become job-ready full-stack developers.',
        category: 'Web Development',
        provider: 'Tech Academy',
        instructor: alice._id,
        duration: '12 weeks',
        rating: 4.8,
        ratingCount: 2340,
        isPublished: true,
        thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600&auto=format&fit=crop',
      },
      {
        title: 'Machine Learning Fundamentals',
        description:
          'Learn the core algorithms and intuitions behind machine learning — from linear regression ' +
          'and decision trees to neural networks. Includes hands-on projects using Python, ' +
          'scikit-learn, and TensorFlow. You will train, evaluate, and deploy real models by the end. ' +
          'Prior Python knowledge is recommended.',
        category: 'Machine Learning',
        provider: 'AI Institute',
        instructor: alice._id,
        duration: '10 weeks',
        rating: 4.9,
        ratingCount: 1820,
        isPublished: true,
        thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&auto=format&fit=crop',
      },
      {
        title: 'Cyber Security Essentials',
        description:
          'Understand how attackers think so you can defend effectively. This course covers ' +
          'network security, cryptography, ethical hacking, and incident response. You will ' +
          'practice in hands-on labs using Kali Linux, Wireshark, and Metasploit. ' +
          'No prior security experience needed.',
        category: 'Cyber Security',
        provider: 'Security Labs',
        instructor: bob._id,
        duration: '8 weeks',
        rating: 4.7,
        ratingCount: 987,
        isPublished: true,
        thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop',
      },
      {
        title: 'UI/UX Design Masterclass',
        description:
          'From user research to high-fidelity Figma prototypes, master the complete product design ' +
          'process. Learn design systems, accessibility standards (WCAG), and how to present your ' +
          'work to stakeholders. Build a professional portfolio with three case studies. ' +
          'Beginner-friendly — no design experience required.',
        category: 'UI/UX Design',
        provider: 'Design Studio',
        instructor: bob._id,
        duration: '6 weeks',
        rating: 4.6,
        ratingCount: 1230,
        isPublished: true,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format&fit=crop',
      },
      {
        title: 'Cloud Computing with AWS',
        description:
          'Master Amazon Web Services — EC2, S3, Lambda, RDS, and more. Learn cloud architecture ' +
          'patterns, serverless design, infrastructure as code with CloudFormation, and cost ' +
          'optimisation. Prepares you for the AWS Solutions Architect Associate certification.',
        category: 'Cloud Computing',
        provider: 'Cloud Academy',
        instructor: alice._id,
        duration: '9 weeks',
        rating: 0,
        ratingCount: 0,
        isPublished: false, // draft — not visible in catalog
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop',
      },
    ]);
    console.info(`Created ${courses.length} courses`);

    const [webDev, mlCourse, secCourse, , ] = courses;

    // ── Module + Quiz blueprints ───────────────────────────────────────────────
    const blueprints = [
      // ── Course 0: Full-Stack Web Dev ───────────────────────────────────────
      {
        courseIndex: 0,
        modules: [
          {
            title: 'HTML & CSS Foundations',
            order: 1,
            videoUrl: VIDEOS[0],
            videoOverview:
              'Learn the building blocks of the web — semantic HTML5, the CSS box model, ' +
              'flexbox, and grid layouts. By the end of this lesson you will have built your ' +
              'first fully responsive webpage.',
            videoDurationSeconds: 596,
            questions: [
              {
                question: 'Which HTML5 element defines the main content area of a page?',
                options: ['<section>', '<article>', '<main>', '<aside>'],
                correctAnswer: 2,
              },
              {
                question: 'In CSS Flexbox, which property aligns items along the cross axis?',
                options: ['justify-content', 'align-items', 'flex-direction', 'flex-wrap'],
                correctAnswer: 1,
              },
              {
                question: "What does CSS Grid's \"fr\" unit represent?",
                options: [
                  'Fixed pixel ratio',
                  'Fractional unit of available space',
                  'Font-relative size',
                  'Frame count',
                ],
                correctAnswer: 1,
              },
              {
                question: 'Which HTML attribute makes a form input required?',
                options: ['mandatory', 'required', 'validate', 'necessary'],
                correctAnswer: 1,
              },
              {
                question: 'Which CSS property controls spacing inside an element (between border and content)?',
                options: ['margin', 'border-spacing', 'padding', 'gap'],
                correctAnswer: 2,
              },
            ],
          },
          {
            title: 'JavaScript & DOM Manipulation',
            order: 2,
            videoUrl: VIDEOS[1],
            videoOverview:
              'Dive into modern JavaScript (ES6+). Learn variables, arrow functions, ' +
              'promises, async/await, and DOM manipulation to create truly interactive pages.',
            videoDurationSeconds: 653,
            questions: [
              {
                question: 'What does the "const" keyword do in JavaScript?',
                options: [
                  'Creates a variable that can be reassigned',
                  'Creates a block-scoped constant binding',
                  'Creates a global variable',
                  'Declares a class',
                ],
                correctAnswer: 1,
              },
              {
                question: 'Which method attaches an event listener to a DOM element?',
                options: ['attachEvent()', 'addEventListener()', 'onEvent()', 'bindEvent()'],
                correctAnswer: 1,
              },
              {
                question: 'What does Array.prototype.map() return?',
                options: [
                  'The original array modified in place',
                  'A new array with each element transformed',
                  'A boolean',
                  'The first matching element',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What is the output of typeof null in JavaScript?',
                options: ['"null"', '"undefined"', '"object"', '"boolean"'],
                correctAnswer: 2,
              },
              {
                question: 'Which construct handles errors in async/await code?',
                options: ['catch()', 'try/catch', '.error()', '.finally()'],
                correctAnswer: 1,
              },
            ],
          },
          {
            title: 'React & Component Architecture',
            order: 3,
            videoUrl: VIDEOS[2],
            videoOverview:
              'Learn React from scratch — JSX, functional components, useState, useEffect, ' +
              'useContext, and props. Build a complete todo app using React best practices.',
            videoDurationSeconds: 179,
            questions: [
              {
                question: 'Which hook manages local state in a functional React component?',
                options: ['useEffect', 'useRef', 'useState', 'useReducer'],
                correctAnswer: 2,
              },
              {
                question: 'What does useEffect with an empty dependency array [] do?',
                options: [
                  'Runs on every render',
                  'Runs only on unmount',
                  'Runs exactly once after the first render',
                  'Never runs',
                ],
                correctAnswer: 2,
              },
              {
                question: 'How should you update state that depends on the previous state?',
                options: [
                  'setState(newValue)',
                  'setState(prev => prev + 1)',
                  'this.state = newValue',
                  'forceUpdate()',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What is JSX?',
                options: [
                  'A JavaScript package manager',
                  'A syntax extension that resembles HTML inside JavaScript files',
                  'A CSS-in-JS library',
                  'A React testing framework',
                ],
                correctAnswer: 1,
              },
              {
                question: 'Which prop is required when rendering a list in React to avoid warnings?',
                options: ['id', 'ref', 'key', 'index'],
                correctAnswer: 2,
              },
            ],
          },
        ],
      },

      // ── Course 1: Machine Learning ─────────────────────────────────────────
      {
        courseIndex: 1,
        modules: [
          {
            title: 'Introduction to Machine Learning',
            order: 1,
            videoUrl: VIDEOS[0],
            videoOverview:
              'Understand the ML landscape — supervised vs unsupervised learning, key terminology, ' +
              'and the standard workflow. Set up Python with NumPy, Pandas, and scikit-learn.',
            videoDurationSeconds: 596,
            questions: [
              {
                question: 'What type of learning uses labelled training data?',
                options: [
                  'Unsupervised learning',
                  'Supervised learning',
                  'Reinforcement learning',
                  'Self-supervised learning',
                ],
                correctAnswer: 1,
              },
              {
                question: 'Which metric measures the proportion of true positives out of all predicted positives?',
                options: ['Recall', 'Accuracy', 'Precision', 'F1 Score'],
                correctAnswer: 2,
              },
              {
                question: 'What is overfitting?',
                options: [
                  'Good performance on both training and test data',
                  'Good performance on training data but poor generalisation to new data',
                  'Training data is too small',
                  'The learning rate is too low',
                ],
                correctAnswer: 1,
              },
              {
                question: 'Which algorithm is commonly used for classification?',
                options: ['K-Means', 'DBSCAN', 'Linear Regression', 'Decision Tree'],
                correctAnswer: 3,
              },
              {
                question: 'What does cross-validation primarily help prevent?',
                options: [
                  'Underfitting only',
                  'Data leakage only',
                  'Overfitting and gives better performance estimates',
                  'Slow training',
                ],
                correctAnswer: 2,
              },
            ],
          },
          {
            title: 'Data Preprocessing & Feature Engineering',
            order: 2,
            videoUrl: VIDEOS[1],
            videoOverview:
              'Clean real-world datasets, handle missing values, encode categoricals, ' +
              'scale features, and engineer new features. This step determines model quality.',
            videoDurationSeconds: 653,
            questions: [
              {
                question: 'Which technique scales features to mean=0 and std=1?',
                options: [
                  'Min-Max Normalisation',
                  'Standard Scaling (Z-score)',
                  'Log Transform',
                  'Binning',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What is one-hot encoding used for?',
                options: [
                  'Numerical feature scaling',
                  'Converting categorical variables to numerical form',
                  'Handling missing values',
                  'Dimensionality reduction',
                ],
                correctAnswer: 1,
              },
              {
                question: 'Which strategy replaces missing values with the column mean?',
                options: ['Forward fill', 'Deletion', 'Mean imputation', 'Regression imputation'],
                correctAnswer: 2,
              },
              {
                question: 'What is feature selection?',
                options: [
                  'Creating new features from existing ones',
                  'Choosing only the most relevant features',
                  'Scaling all features to the same range',
                  'Removing duplicate rows',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What does PCA stand for?',
                options: [
                  'Principal Component Analysis',
                  'Predictive Cluster Algorithm',
                  'Partial Correlation Analysis',
                  'Parameter Configuration Analysis',
                ],
                correctAnswer: 0,
              },
            ],
          },
          {
            title: 'Neural Networks & Deep Learning',
            order: 3,
            videoUrl: VIDEOS[2],
            videoOverview:
              'From perceptrons to multi-layer networks. Understand backpropagation, ' +
              'activation functions, dropout, and batch normalisation. Build your first ' +
              'neural network in TensorFlow/Keras.',
            videoDurationSeconds: 179,
            questions: [
              {
                question: 'What is the role of an activation function in a neural network?',
                options: [
                  'To initialise weights',
                  'To introduce non-linearity',
                  'To calculate the loss',
                  'To normalise inputs',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What does backpropagation do?',
                options: [
                  'Forward-passes data through the network',
                  'Adjusts weights by propagating error gradients backward',
                  'Shuffles the training data',
                  'Regularises the network',
                ],
                correctAnswer: 1,
              },
              {
                question: 'Which optimiser uses both first and second moment estimates of gradients?',
                options: ['SGD', 'RMSProp', 'Adam', 'Adagrad'],
                correctAnswer: 2,
              },
              {
                question: 'What is dropout in neural networks?',
                options: [
                  'Removing layers from the network',
                  'Randomly zeroing some activations during training to prevent overfitting',
                  'A type of activation function',
                  'A loss function',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What does batch normalisation do?',
                options: [
                  'Splits data into batches',
                  'Normalises layer inputs to reduce internal covariate shift',
                  'A type of regularisation like dropout',
                  'Normalises the raw dataset',
                ],
                correctAnswer: 1,
              },
            ],
          },
        ],
      },

      // ── Course 2: Cyber Security ───────────────────────────────────────────
      {
        courseIndex: 2,
        modules: [
          {
            title: 'Network Security Fundamentals',
            order: 1,
            videoUrl: VIDEOS[0],
            videoOverview:
              'TCP/IP networking, common attack vectors (MITM, DoS, SQL injection), ' +
              'firewall configuration, and VPN setup. Learn how attackers think.',
            videoDurationSeconds: 596,
            questions: [
              {
                question: 'What does a firewall primarily do?',
                options: [
                  'Encrypts data at rest',
                  'Controls incoming and outgoing network traffic based on rules',
                  'Scans for viruses',
                  'Manages user authentication',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What is a Man-in-the-Middle (MITM) attack?',
                options: [
                  'Flooding a server with requests',
                  'An attacker secretly relaying communication between two parties',
                  'Guessing passwords by brute force',
                  'Injecting malicious code into a database query',
                ],
                correctAnswer: 1,
              },
              {
                question: 'Which port does HTTPS use by default?',
                options: ['80', '8080', '443', '22'],
                correctAnswer: 2,
              },
              {
                question: 'What does SQL injection exploit?',
                options: [
                  'Buffer overflow vulnerabilities',
                  'Unvalidated user input inserted into SQL queries',
                  'Weak encryption algorithms',
                  'Misconfigured firewalls',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What is the primary purpose of a VPN?',
                options: [
                  'Speed up internet connection',
                  'Create an encrypted tunnel for secure remote access',
                  'Block ads and trackers',
                  'Monitor network traffic',
                ],
                correctAnswer: 1,
              },
            ],
          },
          {
            title: 'Cryptography & Encryption',
            order: 2,
            videoUrl: VIDEOS[1],
            videoOverview:
              'Symmetric and asymmetric encryption, hashing algorithms (SHA-256, bcrypt), ' +
              'digital signatures, SSL/TLS, and PKI. Learn how crypto secures modern apps.',
            videoDurationSeconds: 653,
            questions: [
              {
                question: 'What distinguishes symmetric from asymmetric encryption?',
                options: [
                  'Symmetric uses two keys; asymmetric uses one',
                  'Symmetric uses one key for both encrypt/decrypt; asymmetric uses a key pair',
                  'They are functionally identical',
                  'Symmetric is always less secure',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What is "collision resistance" in a hash function?',
                options: [
                  'The hash is fast to compute',
                  'It is computationally infeasible to find two inputs with the same hash',
                  'The hash output can be reversed',
                  'The hash output length varies by input',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What does TLS/SSL provide?',
                options: [
                  'Faster internet speeds',
                  'Authenticated and encrypted communication between client and server',
                  'Virus protection',
                  'Firewall functionality',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What is a digital signature used for?',
                options: [
                  'Encrypting large files',
                  'Verifying the sender identity and message integrity',
                  'Compressing files for transfer',
                  'Hashing passwords for storage',
                ],
                correctAnswer: 1,
              },
              {
                question: 'Which algorithm is standard for asymmetric encryption?',
                options: ['AES', 'MD5', 'RSA', 'SHA-256'],
                correctAnswer: 2,
              },
            ],
          },
          {
            title: 'Ethical Hacking & Penetration Testing',
            order: 3,
            videoUrl: VIDEOS[2],
            videoOverview:
              'The penetration testing methodology — reconnaissance, scanning, exploitation, ' +
              'post-exploitation, and reporting. Use Nmap, Metasploit, and Burp Suite in a lab.',
            videoDurationSeconds: 179,
            questions: [
              {
                question: 'What is the first phase of a penetration test?',
                options: ['Exploitation', 'Reporting', 'Reconnaissance', 'Scanning'],
                correctAnswer: 2,
              },
              {
                question: 'Which tool is most commonly used for network port scanning?',
                options: ['Wireshark', 'Metasploit', 'Nmap', 'Burp Suite'],
                correctAnswer: 2,
              },
              {
                question: 'What is a zero-day vulnerability?',
                options: [
                  'A bug patched for exactly 0 days',
                  'An unknown vulnerability with no existing patch',
                  'A DNS vulnerability',
                  'A denial-of-service vector',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What does XSS stand for?',
                options: [
                  'Extended Security System',
                  'Cross-Site Scripting',
                  'Extra Security Standard',
                  'Cross-Service Scanning',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What is social engineering in cybersecurity?',
                options: [
                  'Building social media applications',
                  'Manipulating people into revealing confidential information',
                  'Network segmentation techniques',
                  'Encrypting communications end-to-end',
                ],
                correctAnswer: 1,
              },
            ],
          },
        ],
      },

      // ── Course 3: UI/UX Design ─────────────────────────────────────────────
      {
        courseIndex: 3,
        modules: [
          {
            title: 'Design Thinking & User Research',
            order: 1,
            videoUrl: VIDEOS[0],
            videoOverview:
              'The design thinking process: empathise, define, ideate, prototype, test. ' +
              'Conduct user interviews, create personas, and map user journeys.',
            videoDurationSeconds: 596,
            questions: [
              {
                question: 'What is the first step in the Design Thinking process?',
                options: ['Prototype', 'Test', 'Empathize', 'Define'],
                correctAnswer: 2,
              },
              {
                question: 'What is a user persona?',
                options: [
                  'A real user of your product',
                  'A fictional character representing a user segment based on research',
                  'A stakeholder document',
                  'A product specification',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What does a user journey map show?',
                options: [
                  'The UI layout of an app',
                  'The technical architecture',
                  "The steps a user takes to achieve a goal and their emotional state",
                  'Database schema',
                ],
                correctAnswer: 2,
              },
              {
                question: 'Which method involves observing users in their natural environment?',
                options: ['Surveys', 'Contextual inquiry', 'A/B testing', 'Usability benchmarking'],
                correctAnswer: 1,
              },
              {
                question: 'What is affinity mapping used for?',
                options: [
                  'Creating wireframes',
                  'Organising research data into themes and patterns',
                  'Prototyping interactions',
                  'Choosing a colour palette',
                ],
                correctAnswer: 1,
              },
            ],
          },
          {
            title: 'Wireframing & Prototyping with Figma',
            order: 2,
            videoUrl: VIDEOS[1],
            videoOverview:
              'Master Figma — components, auto-layout, interactive prototypes, and design systems. ' +
              'Go from rough sketches to a clickable prototype ready for user testing.',
            videoDurationSeconds: 653,
            questions: [
              {
                question: 'What is the purpose of low-fidelity wireframes?',
                options: [
                  'Final pixel-perfect visual design',
                  'Quick layout exploration without visual details',
                  'User testing with realistic interactions',
                  'Brand identity exploration',
                ],
                correctAnswer: 1,
              },
              {
                question: 'In Figma, what are Components used for?',
                options: [
                  'Adding animations to prototypes',
                  'Reusable design elements that update globally when the master is changed',
                  'Exporting assets as SVG',
                  'Managing color styles',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What is Auto Layout in Figma?',
                options: [
                  'Automatically arranging layers alphabetically',
                  'A feature that makes frames resize dynamically based on content',
                  'An AI-powered layout tool',
                  'Snap-to-grid functionality',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What is a design system?',
                options: [
                  'A project management tool for design teams',
                  'A collection of reusable components, guidelines, and patterns ensuring consistency',
                  'A wireframing application',
                  'An accessibility audit checklist',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What is the key difference between a wireframe and a prototype?',
                options: [
                  'They are the same thing',
                  'A wireframe shows structure; a prototype adds interactivity',
                  'A prototype shows structure; a wireframe adds interactivity',
                  'Wireframes are always higher fidelity',
                ],
                correctAnswer: 1,
              },
            ],
          },
          {
            title: 'Visual Design & Accessibility',
            order: 3,
            videoUrl: VIDEOS[2],
            videoOverview:
              'Colour theory, typography, visual hierarchy, and WCAG accessibility standards. ' +
              'Design interfaces that are beautiful and inclusive for all users.',
            videoDurationSeconds: 179,
            questions: [
              {
                question: 'What WCAG level is minimum recommended for most websites?',
                options: ['WCAG A', 'WCAG AA', 'WCAG AAA', 'WCAG B'],
                correctAnswer: 1,
              },
              {
                question: 'What is the minimum contrast ratio for normal text under WCAG AA?',
                options: ['2:1', '3:1', '4.5:1', '7:1'],
                correctAnswer: 2,
              },
              {
                question: 'What does the 60-30-10 colour rule describe?',
                options: [
                  'Page load time targets',
                  'Colour distribution: dominant (60%), secondary (30%), accent (10%)',
                  'Grid column ratios',
                  'Font size hierarchy',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What is visual hierarchy?',
                options: [
                  'Alphabetical ordering of UI elements',
                  'Arranging elements to guide the eye and convey relative importance',
                  'Consistent font usage throughout a design',
                  'Contrast level requirements',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What does "alt text" on images provide?',
                options: [
                  'A caption displayed below the image',
                  'A text alternative for screen readers and when the image fails to load',
                  'Image metadata for search engines only',
                  'A tooltip on hover',
                ],
                correctAnswer: 1,
              },
            ],
          },
        ],
      },

      // ── Course 4: Cloud Computing / AWS (draft) ────────────────────────────
      {
        courseIndex: 4,
        modules: [
          {
            title: 'AWS Core Services Overview',
            order: 1,
            videoUrl: VIDEOS[0],
            videoOverview:
              'Introduction to AWS — EC2, S3, IAM, and VPC. Set up your account, ' +
              'configure billing alerts, and launch your first EC2 instance.',
            videoDurationSeconds: 596,
            questions: [
              {
                question: 'What does EC2 stand for?',
                options: [
                  'Elastic Compute Cloud',
                  'Extended Container Cloud',
                  'Enterprise Cloud Computing',
                  'Elastic Container Core',
                ],
                correctAnswer: 0,
              },
              {
                question: 'Which AWS service provides object storage?',
                options: ['EC2', 'RDS', 'S3', 'Lambda'],
                correctAnswer: 2,
              },
              {
                question: 'What is IAM used for?',
                options: [
                  'Database management',
                  'Managing user access and permissions to AWS services',
                  'Content delivery via CDN',
                  'Auto-scaling compute',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What is an Availability Zone in AWS?',
                options: [
                  'A billing category',
                  'A geographically separate data centre within a region',
                  'A type of storage class',
                  'A network routing protocol',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What is AWS Lambda?',
                options: [
                  'A managed ML service',
                  'A serverless compute service that runs code in response to events',
                  'A relational database service',
                  'A load balancer',
                ],
                correctAnswer: 1,
              },
            ],
          },
          {
            title: 'Serverless Architecture & DevOps',
            order: 2,
            videoUrl: VIDEOS[1],
            videoOverview:
              'Build serverless apps with Lambda, API Gateway, and DynamoDB. ' +
              'Set up CI/CD with CodePipeline and infrastructure-as-code with CloudFormation.',
            videoDurationSeconds: 653,
            questions: [
              {
                question: 'What is the purpose of API Gateway on AWS?',
                options: [
                  'Database connection pooling',
                  'Creating, securing, and managing RESTful/HTTP APIs',
                  'Load balancing EC2 instances',
                  'Managing DNS records',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What does IaC stand for?',
                options: [
                  'Internet as a Cloud',
                  'Infrastructure as Code',
                  'Instance and Container',
                  'Internal Application Config',
                ],
                correctAnswer: 1,
              },
              {
                question: 'Which AWS service provides managed container orchestration?',
                options: ['Lambda', 'ECS', 'S3', 'CloudFront'],
                correctAnswer: 1,
              },
              {
                question: 'What is the purpose of CloudFormation?',
                options: [
                  'Monitoring application logs',
                  'Provision and manage AWS infrastructure using declarative templates',
                  'Managing DNS and domains',
                  'Content delivery acceleration',
                ],
                correctAnswer: 1,
              },
              {
                question: 'What does auto-scaling do in AWS?',
                options: [
                  'Automatically patches EC2 instances',
                  'Adjusts compute capacity up or down based on actual demand',
                  'Backs up data on a schedule',
                  'Manages IAM roles automatically',
                ],
                correctAnswer: 1,
              },
            ],
          },
        ],
      },
    ];

    // ── Create modules and quizzes ────────────────────────────────────────────
    let totalModules = 0;
    let totalQuizzes = 0;

    for (const blueprint of blueprints) {
      const course = courses[blueprint.courseIndex];
      for (const modData of blueprint.modules) {
        const { questions, ...moduleFields } = modData;
        const module = await Module.create({ ...moduleFields, course: course._id });
        totalModules += 1;
        if (questions?.length) {
          await Quiz.create({ module: module._id, questions, passingScore: 80 });
          totalQuizzes += 1;
        }
      }
    }
    console.info(`Created ${totalModules} modules and ${totalQuizzes} quizzes`);

    // ── Enrollments ───────────────────────────────────────────────────────────
    const webDevModules = await Module.find({ course: webDev._id }).sort({ order: 1 });

    // Sarah: Web Dev in-progress (module 1 done), ML saved
    await Enrollment.create({
      student: sarah._id,
      course: webDev._id,
      status: 'in-progress',
      progressPercent: 33,
      progressText: 'Module 2',
      completedModules: [webDevModules[0]._id],
    });
    await Enrollment.create({
      student: sarah._id,
      course: mlCourse._id,
      status: 'saved',
      progressPercent: 0,
      progressText: 'Not Started',
    });

    // Mike: Web Dev in-progress (modules 1+2 done), Security saved
    await Enrollment.create({
      student: mike._id,
      course: webDev._id,
      status: 'in-progress',
      progressPercent: 67,
      progressText: 'Module 3',
      completedModules: [webDevModules[0]._id, webDevModules[1]._id],
    });
    await Enrollment.create({
      student: mike._id,
      course: secCourse._id,
      status: 'saved',
      progressPercent: 0,
      progressText: 'Not Started',
    });

    console.info('Created 4 enrollments');
    console.info('\n── Seed complete ──────────────────────────────────────────────');
    console.info('admin@edu.com       / Admin1234!');
    console.info('alice@edu.com       / Instructor1!');
    console.info('bob@edu.com         / Instructor2!');
    console.info('student1@edu.com    / Student123!');
    console.info('student2@edu.com    / Student123!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    try { await mongoose.connection.close(); } catch { /* ignore */ }
    process.exit(1);
  }
};

seed();
