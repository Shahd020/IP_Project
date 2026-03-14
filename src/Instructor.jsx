import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Menu, Plus, Trash2, CheckCircle2, BookOpen, BarChart3, ClipboardCheck } from "lucide-react";

function Instructor({ roleLabel = "Instructor", pageTitle = "Instructor Course Creator" }) {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [moduleInput, setModuleInput] = useState("");
  const [materialInput, setMaterialInput] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [modules, setModules] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [courses, setCourses] = useState([]);

  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [enrollCourseId, setEnrollCourseId] = useState("");
  const [studentName, setStudentName] = useState("");

  const [progressCourseId, setProgressCourseId] = useState("");
  const [progressStudentName, setProgressStudentName] = useState("");
  const [progressPercent, setProgressPercent] = useState("");

  const [quizCourseId, setQuizCourseId] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  const addModule = () => {
    const value = moduleInput.trim();

    if (value !== "") {
      setModules([...modules, value]);
      setModuleInput("");
    }
  };

  const addMaterial = () => {
    const value = materialInput.trim();

    if (value !== "") {
      setMaterials([...materials, value]);
      setMaterialInput("");
    }
  };

  const addQuiz = () => {
    const cleanQuestion = question.trim();
    const cleanAnswer = answer.trim();

    if (cleanQuestion !== "" && cleanAnswer !== "") {
      setQuiz([...quiz, { question: cleanQuestion, answer: cleanAnswer }]);
      setQuestion("");
      setAnswer("");
    }
  };

  const removeModule = (index) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const removeMaterial = (index) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const removeQuizQuestion = (index) => {
    setQuiz(quiz.filter((_, i) => i !== index));
  };

  const createCourse = () => {
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (cleanTitle === "" || cleanDescription === "") {
      setFeedback({ type: "error", message: "Course title and description are required." });
      return;
    }

    if (modules.length === 0 || materials.length === 0 || quiz.length === 0) {
      setFeedback({ type: "error", message: "Please add at least one module, one material, and one quiz question." });
      return;
    }

    const alreadyExists = courses.some((course) => course.title.toLowerCase() === cleanTitle.toLowerCase());

    if (alreadyExists) {
      setFeedback({ type: "error", message: "A course with this title already exists." });
      return;
    }

    const newCourseId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const newCourse = {
      id: newCourseId,
      title: cleanTitle,
      description: cleanDescription,
      modules: [...modules],
      materials: [...materials],
      quiz: [...quiz],
      enrollments: [],
      progress: []
    };

    setCourses([...courses, newCourse]);
    setSelectedCourseId(newCourseId);

    setTitle("");
    setDescription("");
    setModules([]);
    setMaterials([]);
    setQuiz([]);

    setFeedback({ type: "success", message: "Course created successfully!" });
  };

  const deleteCourse = (courseId) => {
    setCourses(courses.filter((course) => course.id !== courseId));

    if (selectedCourseId === courseId) {
      setSelectedCourseId(null);
    }

    if (enrollCourseId === courseId) {
      setEnrollCourseId("");
    }

    if (progressCourseId === courseId) {
      setProgressCourseId("");
    }

    if (quizCourseId === courseId) {
      setQuizCourseId("");
      setQuizAnswers({});
      setQuizResult(null);
    }

    setFeedback({ type: "success", message: "Course removed successfully." });
  };

  const enrollStudent = () => {
    const cleanName = studentName.trim();

    if (enrollCourseId === "" || cleanName === "") {
      setFeedback({ type: "error", message: "Please select a course and enter student name for enrollment." });
      return;
    }

    const updatedCourses = courses.map((course) => {
      if (course.id !== enrollCourseId) {
        return course;
      }

      const alreadyEnrolled = course.enrollments.some((name) => name.toLowerCase() === cleanName.toLowerCase());

      if (alreadyEnrolled) {
        return course;
      }

      return {
        ...course,
        enrollments: [...course.enrollments, cleanName]
      };
    });

    setCourses(updatedCourses);
    setStudentName("");
    setFeedback({ type: "success", message: `${cleanName} was successfully enrolled.` });
  };

  const updateProgress = () => {
    const cleanName = progressStudentName.trim();
    const numericProgress = Number(progressPercent);

    if (progressCourseId === "" || cleanName === "" || Number.isNaN(numericProgress)) {
      setFeedback({ type: "error", message: "Please provide course, student name, and valid progress value." });
      return;
    }

    if (numericProgress < 0 || numericProgress > 100) {
      setFeedback({ type: "error", message: "Progress must be between 0 and 100." });
      return;
    }

    const updatedCourses = courses.map((course) => {
      if (course.id !== progressCourseId) {
        return course;
      }

      const existingIndex = course.progress.findIndex((entry) => entry.student.toLowerCase() === cleanName.toLowerCase());

      if (existingIndex === -1) {
        return {
          ...course,
          progress: [...course.progress, { student: cleanName, percent: numericProgress }]
        };
      }

      const nextProgress = [...course.progress];
      nextProgress[existingIndex] = { student: cleanName, percent: numericProgress };

      return {
        ...course,
        progress: nextProgress
      };
    });

    setCourses(updatedCourses);
    setProgressStudentName("");
    setProgressPercent("");
    setFeedback({ type: "success", message: "Student learning progress updated." });
  };

  const submitQuiz = () => {
    if (quizCourseId === "") {
      setFeedback({ type: "error", message: "Please choose a course to evaluate quiz results." });
      return;
    }

    const selectedCourse = courses.find((course) => course.id === quizCourseId);

    if (!selectedCourse || selectedCourse.quiz.length === 0) {
      setFeedback({ type: "error", message: "Selected course has no quiz questions." });
      return;
    }

    let score = 0;

    selectedCourse.quiz.forEach((item, index) => {
      const key = `${selectedCourse.id}-${index}`;
      const entered = (quizAnswers[key] || "").trim().toLowerCase();
      const expected = item.answer.trim().toLowerCase();

      if (entered !== "" && entered === expected) {
        score += 1;
      }
    });

    const total = selectedCourse.quiz.length;
    const percent = Math.round((score / total) * 100);

    let grade = "F";

    if (percent >= 90) grade = "A";
    else if (percent >= 80) grade = "B";
    else if (percent >= 70) grade = "C";
    else if (percent >= 60) grade = "D";

    setQuizResult({
      courseTitle: selectedCourse.title,
      score,
      total,
      percent,
      grade
    });

    setFeedback({ type: "success", message: "Quiz results and grades generated." });
  };

  const selectedCourse = courses.find((course) => course.id === selectedCourseId) || null;
  const selectedQuizCourse = courses.find((course) => course.id === quizCourseId) || null;

  const totalEnrolled = courses.reduce((sum, course) => sum + course.enrollments.length, 0);
  const allProgressEntries = courses.flatMap((course) =>
    course.progress.map((entry) => ({
      courseTitle: course.title,
      ...entry
    }))
  );
  const averageProgress = allProgressEntries.length
    ? Math.round(allProgressEntries.reduce((sum, entry) => sum + entry.percent, 0) / allProgressEntries.length)
    : 0;

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">

      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-20"} bg-[#1f2937] p-6 transition-all duration-300`}>

        <div className="flex justify-between items-center mb-10">
          {sidebarOpen && <h1 className="text-xl font-bold">{roleLabel}</h1>}

          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>
        </div>

        <nav className="space-y-6">

          <Link to="/" className="flex items-center gap-3 hover:text-blue-400">
            <Home size={18} />
            {sidebarOpen && "Home"}
          </Link>

        </nav>

      </div>


      {/* Main Content */}
      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-6">
          {pageTitle}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1f2937] rounded-xl p-4">
            <p className="text-gray-400 text-sm">List of available courses</p>
            <p className="text-2xl font-bold mt-1">{courses.length}</p>
          </div>
          <div className="bg-[#1f2937] rounded-xl p-4">
            <p className="text-gray-400 text-sm">Successfully enrolled students</p>
            <p className="text-2xl font-bold mt-1">{totalEnrolled}</p>
          </div>
          <div className="bg-[#1f2937] rounded-xl p-4">
            <p className="text-gray-400 text-sm">Student learning progress</p>
            <p className="text-2xl font-bold mt-1">{averageProgress}%</p>
          </div>
        </div>

        {/* Course Form */}
        <div className="bg-[#1f2937] p-6 rounded-xl mb-10">

          <h2 className="text-xl font-semibold mb-4">
            Create New Course
          </h2>

          <input
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded mb-3 text-black"
          />

          <textarea
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded mb-4 text-black"
          />

          {/* Modules */}
          <div className="mb-4">

            <h3 className="font-semibold mb-2">
              Course Modules
            </h3>

            <div className="flex gap-2">

              <input
                placeholder="Module name"
                value={moduleInput}
                onChange={(e) => setModuleInput(e.target.value)}
                className="flex-1 p-2 rounded text-black"
              />

              <button
                onClick={addModule}
                className="bg-blue-500 px-4 rounded"
              >
                <Plus size={16}/>
              </button>

            </div>

            <ul className="mt-2 text-gray-300">
              {modules.map((m, i) => (
                <li key={i} className="flex items-center justify-between gap-3">
                  <span>• {m}</span>
                  <button
                    type="button"
                    onClick={() => removeModule(i)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>

          </div>

          {/* Learning Materials */}
          <div className="mb-4">

            <h3 className="font-semibold mb-2">
              Learning Materials
            </h3>

            <div className="flex gap-2">

              <input
                placeholder="Material (video/pdf)"
                value={materialInput}
                onChange={(e) => setMaterialInput(e.target.value)}
                className="flex-1 p-2 rounded text-black"
              />

              <button
                onClick={addMaterial}
                className="bg-green-500 px-4 rounded"
              >
                <Plus size={16}/>
              </button>

            </div>

            <ul className="mt-2 text-gray-300">
              {materials.map((m, i) => (
                <li key={i} className="flex items-center justify-between gap-3">
                  <span>• {m}</span>
                  <button
                    type="button"
                    onClick={() => removeMaterial(i)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>

          </div>

          {/* Quiz */}
          <div className="mb-4">

            <h3 className="font-semibold mb-2">
              Quiz Questions
            </h3>

            <input
              placeholder="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-2 rounded text-black mb-2"
            />

            <input
              placeholder="Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-2 rounded text-black mb-2"
            />

            <button
              onClick={addQuiz}
              className="bg-purple-500 px-4 py-1 rounded"
            >
              Add Question
            </button>

            <ul className="mt-3 text-gray-300 space-y-2">
              {quiz.map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-3">
                  <span>• {item.question}</span>
                  <button
                    type="button"
                    onClick={() => removeQuizQuestion(i)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>

          </div>

          <button
            onClick={createCourse}
            className="bg-blue-600 px-6 py-2 rounded"
          >
            Create Course
          </button>

          {feedback.message && (
            <p className={`mt-3 ${feedback.type === "error" ? "text-red-400" : "text-green-400"}`}>
              {feedback.message}
            </p>
          )}

        </div>

        {/* Enrollment */}
        <div className="bg-[#1f2937] p-6 rounded-xl mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 size={20} />
            Enrollment Feedback
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={enrollCourseId}
              onChange={(e) => setEnrollCourseId(e.target.value)}
              className="p-2 rounded text-black"
            >
              <option value="">Select course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>

            <input
              placeholder="Student name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="p-2 rounded text-black"
            />

            <button onClick={enrollStudent} className="bg-blue-600 px-4 py-2 rounded">
              Enroll Student
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-[#1f2937] p-6 rounded-xl mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Student Learning Progress
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <select
              value={progressCourseId}
              onChange={(e) => setProgressCourseId(e.target.value)}
              className="p-2 rounded text-black"
            >
              <option value="">Select course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>

            <input
              placeholder="Student name"
              value={progressStudentName}
              onChange={(e) => setProgressStudentName(e.target.value)}
              className="p-2 rounded text-black"
            />

            <input
              type="number"
              min="0"
              max="100"
              placeholder="Progress %"
              value={progressPercent}
              onChange={(e) => setProgressPercent(e.target.value)}
              className="p-2 rounded text-black"
            />

            <button onClick={updateProgress} className="bg-blue-600 px-4 py-2 rounded">
              Update Progress
            </button>
          </div>

          <div className="space-y-2 text-gray-300">
            {allProgressEntries.length === 0 && <p>No progress data yet.</p>}
            {allProgressEntries.map((entry, i) => (
              <p key={`${entry.courseTitle}-${entry.student}-${i}`}>
                • {entry.student} - {entry.courseTitle}: {entry.percent}%
              </p>
            ))}
          </div>
        </div>

        {/* Quiz Evaluation */}
        <div className="bg-[#1f2937] p-6 rounded-xl mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ClipboardCheck size={20} />
            Quiz Results and Grades
          </h2>

          <select
            value={quizCourseId}
            onChange={(e) => {
              setQuizCourseId(e.target.value);
              setQuizAnswers({});
              setQuizResult(null);
            }}
            className="p-2 rounded text-black mb-4 w-full md:w-1/2"
          >
            <option value="">Select course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>

          {selectedQuizCourse && (
            <div className="space-y-3 mb-4">
              {selectedQuizCourse.quiz.map((item, index) => {
                const key = `${selectedQuizCourse.id}-${index}`;

                return (
                  <div key={key} className="bg-[#0f172a] p-3 rounded">
                    <p className="mb-2">Q{index + 1}. {item.question}</p>
                    <input
                      placeholder="Type answer"
                      value={quizAnswers[key] || ""}
                      onChange={(e) => setQuizAnswers({ ...quizAnswers, [key]: e.target.value })}
                      className="w-full p-2 rounded text-black"
                    />
                  </div>
                );
              })}

              <button onClick={submitQuiz} className="bg-blue-600 px-4 py-2 rounded">
                Generate Result
              </button>
            </div>
          )}

          {quizResult && (
            <div className="bg-[#0f172a] p-4 rounded text-gray-200">
              <p className="font-semibold mb-1">{quizResult.courseTitle}</p>
              <p>Score: {quizResult.score} / {quizResult.total}</p>
              <p>Percent: {quizResult.percent}%</p>
              <p>Grade: {quizResult.grade}</p>
            </div>
          )}
        </div>

        {/* Output Section */}

        <h2 className="text-2xl font-bold mb-4">
          <span className="inline-flex items-center gap-2">
            <BookOpen size={24} />
            Available Courses
          </span>
        </h2>

        {courses.length === 0 && <p className="text-gray-400 mb-4">No courses yet. Create one above.</p>}

        {courses.map((course) => (

          <div
            key={course.id}
            className="bg-[#1f2937] p-6 rounded-xl mb-4"
          >

            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold">
                  {course.title}
                </h3>

                <p className="text-gray-400 mb-3">
                  {course.description}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCourseId(course.id === selectedCourseId ? null : course.id)}
                  className="bg-blue-600 px-3 py-1 rounded"
                >
                  {course.id === selectedCourseId ? "Hide" : "Details"}
                </button>
                <button
                  onClick={() => deleteCourse(course.id)}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-300">Enrollments: {course.enrollments.length}</p>

            {selectedCourse && selectedCourse.id === course.id && (
              <div className="mt-4 border-t border-gray-700 pt-4">
                <h4 className="font-semibold">Course details and modules</h4>

                <ul className="mb-2 mt-2">
                  {course.modules.map((m, i) => (
                    <li key={i}>• {m}</li>
                  ))}
                </ul>

                <h4 className="font-semibold">
                  Learning Materials
                </h4>

                <ul className="mb-2 mt-2">
                  {course.materials.map((m, i) => (
                    <li key={i}>• {m}</li>
                  ))}
                </ul>

                <h4 className="font-semibold">
                  Quiz Questions
                </h4>

                <ul className="mt-2">
                  {course.quiz.map((q, i) => (
                    <li key={i}>• {q.question}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        ))}

      </div>

    </div>
  );
}

export default Instructor;