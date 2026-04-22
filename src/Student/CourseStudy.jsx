import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, PlayCircle, MessageSquare, CheckCircle, Award,
  BookmarkPlus, Send, Download, Star, AlertCircle
} from "lucide-react";
import useCourseStudy from "../hooks/useCourseStudy.js";
import useSocket from "../hooks/useSocket.js";
import useAuth from "../hooks/useAuth.js";

function CourseStudy() {
  const { courseId } = useParams();
  const videoRef = useRef(null);
  const { user } = useAuth();
  const studentName = user?.name || "Student";

  const {
    course,
    currentModule,
    quiz: quizData,
    forumPosts: initialPosts,
    setForumPosts,
    loading,
    error,
    submitQuiz: submitQuizApi,
  } = useCourseStudy(courseId);

  const { socket } = useSocket(courseId);

  // Adapt API data shape to what the rest of the component already uses
  const courseDisplay = course
    ? {
        id: courseId,
        title: course.title,
        instructor: course.instructor?.name || "Instructor",
        moduleTitle: currentModule?.title || "Loading module...",
        videoUrl: currentModule?.videoUrl || "",
        videoOverview: currentModule?.videoOverview || "",
      }
    : null;

  // Layout State
  const [activeTab, setActiveTab] = useState("video");

  // Reset UI state when the module changes
  useEffect(() => {
    setActiveTab("video");
    setQuizSubmitted(false);
    setQuizScore(0);
    setSelectedAnswers({});
  }, [currentModule?._id]);

  // Seed forum posts from API on load; Socket.io appends live messages below
  useEffect(() => {
    if (initialPosts) setForumPosts(initialPosts);
  }, [initialPosts, setForumPosts]);

  // 1. VIDEO & BOOKMARKS LOGIC (With Local Storage!)
  const [bookmarks, setBookmarks] = useState(() => {
    const savedBookmarks = localStorage.getItem(`bookmarks_${courseId}`);
    if (savedBookmarks) return JSON.parse(savedBookmarks);
    return [];
  });
  const [newBookmarkText, setNewBookmarkText] = useState("");

  useEffect(() => {
    localStorage.setItem(`bookmarks_${courseId}`, JSON.stringify(bookmarks));
  }, [bookmarks, courseId]);

  const handleAddBookmark = (e) => {
    e.preventDefault();
    if (!newBookmarkText.trim() || !videoRef.current) return;
    const currentTime = Math.floor(videoRef.current.currentTime);
    setBookmarks([...bookmarks, { id: Date.now(), time: currentTime, text: newBookmarkText }]);
    setNewBookmarkText("");
  };

  const jumpToTime = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 2. FORUM LOGIC
  const [forumPosts, setForumPostsLocal] = useState([]);
  const [newPostText, setNewPostText] = useState("");

  // Keep local forum state in sync with hook state
  useEffect(() => {
    setForumPostsLocal(initialPosts || []);
  }, [initialPosts]);

  // Listen for real-time messages from Socket.io
  useEffect(() => {
    if (!socket) return;
    const handler = ({ post }) => {
      setForumPostsLocal((prev) => {
        // Deduplicate in case REST and socket deliver the same message
        if (prev.some((p) => p._id === post._id)) return prev;
        return [post, ...prev];
      });
    };
    socket.on("new_message", handler);
    return () => socket.off("new_message", handler);
  }, [socket]);

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    if (socket?.connected) {
      // Real-time path: server will broadcast back via new_message
      socket.emit("send_message", {
        courseId,
        moduleId: currentModule?._id,
        text: newPostText,
      });
    } else {
      // Fallback: optimistic local append (REST path handled by hook)
      setForumPostsLocal((prev) => [
        { _id: Date.now(), author: { name: studentName }, text: newPostText, createdAt: new Date().toISOString() },
        ...prev,
      ]);
    }
    setNewPostText("");
  };

  // 3. QUIZ LOGIC (static fallback â€” backend quiz API integration pending)
  const demoQuiz = [
    { question: "What is a key benefit of component-based architecture?", options: ["Faster compile times", "Reusability and separation of concerns", "Smaller bundle size", "Auto-routing"], correctAnswer: 1 },
    { question: "Which hook runs code after every render by default?", options: ["useState", "useMemo", "useEffect", "useRef"], correctAnswer: 2 },
    { question: "What does the 'key' prop help React do?", options: ["Style elements", "Track list item identity during reconciliation", "Pass data to children", "Memoize components"], correctAnswer: 1 },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const questions = quizData?.questions || [];

  const handleAnswerSelect = (qIndex, oIndex) => {
    if (quizSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [qIndex]: oIndex });
  };

  const submitQuiz = async () => {
    // Build answer map: { questionId: selectedOptionIndex }
    const answers = {};
    questions.forEach((q, i) => {
      if (selectedAnswers[i] !== undefined) answers[q._id] = selectedAnswers[i];
    });
    try {
      const result = await submitQuizApi(answers);
      setQuizScore(result.score);
      setQuizSubmitted(true);
      if (result.passed) setTimeout(() => setActiveTab("certificate"), 1500);
    } catch {
      // Fallback: grade client-side using correctAnswer if server returns it
      setQuizSubmitted(true);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400 text-lg">Loading course...</div>;
  }
  if (error) {
    return (
      <div className="text-center py-20 bg-red-900/20 rounded-xl border border-red-700">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }
  if (!courseDisplay) return null;

  return (
    <div className="max-w-6xl mx-auto pb-12">

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
          <Link to="/student/courses" className="hover:text-blue-400 flex items-center gap-1 transition-colors">
            <ArrowLeft size={16} /> Back to Courses
          </Link>
          <span>/</span>
          <span className="text-gray-200">{courseDisplay.title}</span>
          <span>/</span>
          <span className="text-blue-400">Study Room</span>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-white mb-6">{courseDisplay.moduleTitle}</h1>

      <div className="flex gap-4 mb-8 border-b border-gray-700 overflow-x-auto">
        <button onClick={() => setActiveTab("video")} className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === "video" ? "border-blue-500 text-blue-400" : "border-transparent text-gray-400 hover:text-gray-200"}`}>
          <PlayCircle size={18} /> Video Lesson
        </button>
        <button onClick={() => setActiveTab("forum")} className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === "forum" ? "border-blue-500 text-blue-400" : "border-transparent text-gray-400 hover:text-gray-200"}`}>
          <MessageSquare size={18} /> Course Forum
        </button>
        <button onClick={() => setActiveTab("quiz")} className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === "quiz" ? "border-blue-500 text-blue-400" : "border-transparent text-gray-400 hover:text-gray-200"}`}>
          <CheckCircle size={18} /> Final Quiz
        </button>
        <button onClick={() => setActiveTab("certificate")} className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === "certificate" ? "border-yellow-500 text-yellow-400" : "border-transparent text-gray-400 hover:text-gray-200"}`}>
          <Award size={18} /> Certificate
        </button>
      </div>

      {activeTab === "video" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black rounded-xl overflow-hidden shadow-xl border border-gray-800">
              <video 
                key={courseDisplay.id}
                ref={videoRef}
                controls
                className="w-full aspect-video outline-none"
                src={courseDisplay.videoUrl} 
                poster="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1080&auto=format&fit=crop"
              />
            </div>
            <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-2">Lesson Overview</h2>
              <p className="text-gray-400 text-sm">{courseDisplay.videoOverview}</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-800 h-full flex flex-col shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BookmarkPlus size={20} className="text-blue-400" /> My Bookmarks
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                {bookmarks.length === 0 ? (
                  <p className="text-gray-500 text-sm italic text-center mt-10">No bookmarks yet. Play the video and add one!</p>
                ) : (
                  bookmarks.map(bm => (
                    <div key={bm.id} className="bg-[#0f172a] p-3 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer group" onClick={() => jumpToTime(bm.time)}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 group-hover:bg-blue-500 transition-colors">
                          <PlayCircle size={10} /> {formatTime(bm.time)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{bm.text}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddBookmark} className="mt-auto border-t border-gray-700 pt-4 flex gap-2">
                <input 
                  type="text" 
                  value={newBookmarkText}
                  onChange={(e) => setNewBookmarkText(e.target.value)}
                  placeholder="Note at current time..." 
                  className="flex-1 bg-[#0f172a] text-white text-sm px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors">
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === "forum" && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1f2937] p-6 rounded-xl shadow-xl border border-gray-800 flex flex-col h-[600px]">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Discussion: {courseDisplay.title}</h2>
              <span className="text-sm text-gray-400">{forumPosts.length} posts</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2">
              {forumPostsLocal.map(post => (
                <div key={post.id} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${post.author?._id ? "bg-blue-600" : "bg-gray-600"}`}>
                    {post.author?.name || "User".charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-200">{post.author?.name || "User"}</span>
                      <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</span>
                    </div>
                    <p className="text-gray-300 text-sm bg-[#0f172a] p-4 rounded-xl rounded-tl-none border border-gray-700 inline-block">
                      {post.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddPost} className="relative mt-auto">
              <input 
                type="text" 
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Ask a question or help a classmate..." 
                className="w-full bg-[#0f172a] text-white pl-4 pr-12 py-4 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button type="submit" className="absolute right-3 top-3 text-blue-500 hover:text-blue-400 p-1">
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === "quiz" && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#1f2937] p-8 rounded-xl shadow-xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-2">Module Final Quiz</h2>
            <p className="text-gray-400 mb-8 border-b border-gray-700 pb-6">Pass with 100% to unlock your certificate.</p>

            <div className="space-y-8">
<<<<<<< HEAD
              {(questions)((q, qIndex) => (
=======
<<<<<<< HEAD
              {questions.map((q, qIndex) => (
=======
              {(questions)((q, qIndex) => (
>>>>>>> 9e18abd (phase 2 test lilly)
>>>>>>> e924226 (phase 2 lilly testing)
                <div key={qIndex} className="bg-[#0f172a] p-6 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    <span className="text-blue-500 mr-2">Q{qIndex + 1}.</span> {q.question}
                  </h3>
                  <div className="space-y-3">
                    {q.options.map((opt, oIndex) => {
                      const isSelected = selectedAnswers[qIndex] === oIndex;
                      
                      let optionStyle = "border-gray-600 hover:border-blue-400 text-gray-300";
                      if (isSelected) optionStyle = "border-blue-500 bg-blue-900/20 text-white";
                      if (quizSubmitted) {
                        if (oIndex === q.correctAnswer) optionStyle = "border-green-500 bg-green-900/20 text-green-300"; 
                        else if (isSelected && oIndex !== q.correctAnswer) optionStyle = "border-red-500 bg-red-900/20 text-red-300"; 
                        else optionStyle = "border-gray-700 text-gray-600 opacity-50"; 
                      }

                      return (
                        <div 
                          key={oIndex} 
                          onClick={() => handleAnswerSelect(qIndex, oIndex)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${optionStyle}`}
                        >
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {quizSubmitted ? (
              <div className={`mt-8 p-6 rounded-xl border text-center ${quizScore === questions.length ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
                <h3 className={`text-2xl font-bold mb-2 ${quizScore === questions.length ? 'text-green-400' : 'text-red-400'}`}>
                  You scored {quizScore} out of {questions.length}!
                </h3>
                {quizScore === questions.length ? (
                  <p className="text-gray-300">Perfect! Your certificate is now unlocked.</p>
                ) : (
                  <button onClick={() => { setQuizSubmitted(false); setSelectedAnswers({}); }} className="mt-4 bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold">
                    Try Again
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={submitQuiz}
                disabled={Object.keys(selectedAnswers).length < questions.length}
                className={`mt-8 w-full py-4 rounded-xl font-bold text-lg transition-colors shadow-lg ${
                  Object.keys(selectedAnswers).length === questions.length ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Answers
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === "certificate" && (
        <div className="max-w-4xl mx-auto">
          {quizScore === questions.length ? (
            <div className="flex flex-col items-center">
              
              <div id="certificate" className="bg-[#f8f9fa] w-full aspect-[1.414/1] relative p-10 shadow-2xl overflow-hidden rounded-sm flex items-center justify-center text-center">
                <div className="absolute inset-4 border-2 border-[#1e3a8a]"></div>
                <div className="absolute inset-5 border border-[#1e3a8a] opacity-50"></div>
                
                <div className="z-10 flex flex-col items-center justify-center w-full">
                  <Award size={60} className="text-[#d4af37] mb-6 drop-shadow-md" />
                  
                  <h1 className="text-4xl uppercase tracking-[0.2em] text-[#1e3a8a] font-serif mb-8 border-b-2 border-[#d4af37] pb-4">
                    Certificate of Completion
                  </h1>
                  
                  <p className="text-gray-600 italic mb-4 text-lg">This certifies that</p>
                  
                  <h2 className="text-5xl font-bold text-black font-serif mb-6 px-12 py-2">
                    {studentName}
                  </h2>
                  
                  <p className="text-gray-600 italic mb-4 text-lg">has successfully completed the course</p>
                  
                  <h3 className="text-3xl text-[#1e3a8a] font-semibold mb-12">
                    {courseDisplay.title}
                  </h3>

                  <div className="flex justify-between w-3/4 mt-8 border-t border-gray-400 pt-4">
                    <div>
                      <p className="text-black font-bold">{courseDisplay.instructor}</p>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">Lead Instructor</p>
                    </div>
                    <div>
                      <p className="text-black font-bold">{new Date().toLocaleDateString()}</p>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">Date Completed</p>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <Award size={400} />
                </div>
              </div>

              <button onClick={() => window.print()} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:-translate-y-1">
                <Download size={20} /> Download PDF
              </button>
            </div>
          ) : (
            <div className="bg-[#1f2937] p-12 rounded-xl border border-gray-800 text-center flex flex-col items-center justify-center h-[500px]">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={40} className="text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Certificate Locked</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                You must complete the module and score 100% on the Final Quiz to unlock your official certificate of completion.
              </p>
              <button onClick={() => setActiveTab("quiz")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                Go to Quiz
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default CourseStudy;
