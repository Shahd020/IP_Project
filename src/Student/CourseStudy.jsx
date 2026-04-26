import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, PlayCircle, MessageSquare, CheckCircle, Award,
  BookmarkPlus, Send, Download, AlertCircle, ChevronRight, List,
} from "lucide-react";
import useCourseStudy from "../hooks/useCourseStudy.js";
import useSocket from "../hooks/useSocket.js";
import useAuth from "../hooks/useAuth.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// Throttle helper — limits how often fn is called (video timeupdate fires ~4×/sec)
const throttle = (fn, ms) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...args); }
  };
};

// ─── Component ────────────────────────────────────────────────────────────────

function CourseStudy() {
  const { courseId } = useParams();
  const videoRef = useRef(null);
  const { user } = useAuth();
  const studentName = user?.name || "Student";

  const {
    course,
    enrollment,
    currentModule,
    setCurrentModuleId,
    quiz: quizData,
    forumPosts,
    setForumPosts,
    loading,
    error,
    submitQuiz: submitQuizApi,
    markModuleComplete,
    addForumPost,
  } = useCourseStudy(courseId);

  const { socket } = useSocket(courseId);

  // All modules list (for the sidebar navigation)
  const allModules = course?.modules || [];
  const completedModuleIds = enrollment?.completedModules?.map(String) || [];

  // ─── Tab state ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("video");

  // Reset quiz + tab when module changes
  useEffect(() => {
    setActiveTab("video");
    setQuizSubmitted(false);
    setQuizPassed(false);
    setQuizScore(0);
    setSelectedAnswers({});
  }, [currentModule?._id]);

  // ─── Socket.io: append live messages to the hook's forumPosts ─────────────
  useEffect(() => {
    if (!socket) return;
    const handler = ({ post }) => {
      setForumPosts((prev) => {
        if (prev.some((p) => p._id === post._id)) return prev; // deduplicate
        return [post, ...prev];
      });
    };
    socket.on("new_message", handler);
    return () => socket.off("new_message", handler);
  }, [socket, setForumPosts]);

  // ─── Video & bookmarks ────────────────────────────────────────────────────
  // Bookmarks are stored per-module so they survive module navigation
  const bookmarkKey = `bookmarks_${currentModule?._id || courseId}`;
  const [bookmarks, setBookmarks] = useState([]);
  const [newBookmarkText, setNewBookmarkText] = useState("");

  // Load bookmarks whenever the module changes
  useEffect(() => {
    if (!currentModule?._id) return;
    try {
      const saved = localStorage.getItem(bookmarkKey);
      setBookmarks(saved ? JSON.parse(saved) : []);
    } catch {
      setBookmarks([]);
    }
  }, [currentModule?._id, bookmarkKey]);

  // Persist bookmarks on every change
  useEffect(() => {
    if (!currentModule?._id) return;
    localStorage.setItem(bookmarkKey, JSON.stringify(bookmarks));
  }, [bookmarks, bookmarkKey, currentModule?._id]);

  const handleAddBookmark = (e) => {
    e.preventDefault();
    if (!newBookmarkText.trim() || !videoRef.current) return;
    const time = Math.floor(videoRef.current.currentTime);
    setBookmarks((prev) => [
      ...prev,
      { id: Date.now(), time, text: newBookmarkText.trim() },
    ]);
    setNewBookmarkText("");
  };

  const jumpToTime = (time) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    videoRef.current.play();
  };

  // ─── Video position: save/restore per module ──────────────────────────────
  const videoPositionKey = `vidpos_${currentModule?._id || courseId}`;

  // Restore saved position when module loads
  useEffect(() => {
    if (!currentModule?._id || !videoRef.current) return;
    const saved = parseFloat(localStorage.getItem(videoPositionKey) || "0");
    if (saved > 1) {
      // Delay slightly so the video element has loaded the src
      const t = setTimeout(() => {
        if (videoRef.current) videoRef.current.currentTime = saved;
      }, 300);
      return () => clearTimeout(t);
    }
  }, [currentModule?._id, videoPositionKey]);

  // Save position on timeupdate (throttled to once per 5 s)
  const savePosition = useCallback(
    throttle(() => {
      if (videoRef.current) {
        localStorage.setItem(videoPositionKey, videoRef.current.currentTime.toString());
      }
    }, 5000),
    [videoPositionKey]
  );

  // Mark module complete and clear saved position when video ends
  const handleVideoEnded = useCallback(() => {
    if (currentModule?._id) {
      localStorage.removeItem(videoPositionKey);
      markModuleComplete(currentModule._id);
    }
  }, [currentModule?._id, videoPositionKey, markModuleComplete]);

  // ─── Forum ────────────────────────────────────────────────────────────────
  const [newPostText, setNewPostText] = useState("");

  const handleAddPost = async (e) => {
    e.preventDefault();
    const text = newPostText.trim();
    if (!text) return;
    setNewPostText("");
    if (socket?.connected) {
      // Real-time path — server persists and broadcasts new_message to all room members
      socket.emit("send_message", {
        courseId,
        moduleId: currentModule?._id,
        text,
      });
    } else {
      // REST fallback — persists the message and updates state via the hook
      try {
        await addForumPost(text);
      } catch {
        /* non-critical — post silently fails offline */
      }
    }
  };

  // ─── Quiz ─────────────────────────────────────────────────────────────────
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizPassed, setQuizPassed] = useState(false);

  const questions = quizData?.questions || [];
  const passingScore = quizData?.passingScore ?? 80;

  const handleAnswerSelect = (qIndex, oIndex) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: oIndex }));
  };

  const submitQuiz = async () => {
    // Build { questionId → selectedOptionIndex } map
    const answers = {};
    questions.forEach((q, i) => {
      if (selectedAnswers[i] !== undefined) answers[q._id] = selectedAnswers[i];
    });
    try {
      const result = await submitQuizApi(answers);
      setQuizScore(result.score);
      setQuizSubmitted(true);
      if (result.passed) {
        setQuizPassed(true);
        setTimeout(() => setActiveTab("certificate"), 1500);
      }
    } catch {
      setQuizSubmitted(true);
    }
  };

  // ─── Loading / Error ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400 text-lg animate-pulse">
        Loading course…
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-20 bg-red-900/20 rounded-xl border border-red-700">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }
  if (!course) return null;

  const courseTitle = course.title;
  const instructorName = course.instructor?.name || "Instructor";
  const moduleTitle = currentModule?.title || "Loading module…";
  const videoUrl = currentModule?.videoUrl || "";
  const videoOverview = currentModule?.videoOverview || "";

  return (
    <div className="max-w-6xl mx-auto pb-12">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-400">
        <Link to="/student/courses" className="hover:text-blue-400 flex items-center gap-1 transition-colors">
          <ArrowLeft size={16} /> Back to Courses
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-200 truncate max-w-xs">{courseTitle}</span>
        <ChevronRight size={14} />
        <span className="text-blue-400">Study Room</span>
      </div>

      <h1 className="text-2xl font-bold text-white mb-4">{moduleTitle}</h1>

      {/* ── Module navigation bar ──────────────────────────────────────────── */}
      {allModules.length > 1 && (
        <div className="mb-6 bg-[#1f2937] rounded-xl border border-gray-800 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <List size={14} /> Course Modules
          </p>
          <div className="flex gap-2 flex-wrap">
            {allModules.map((mod) => {
              const isDone = completedModuleIds.includes(String(mod._id));
              const isCurrent = String(mod._id) === String(currentModule?._id);
              return (
                <button
                  key={mod._id}
                  onClick={() => setCurrentModuleId(mod._id)}
                  title={mod.title}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border
                    ${isCurrent
                      ? "border-blue-500 bg-blue-600/20 text-blue-300"
                      : isDone
                      ? "border-green-600/50 bg-green-900/10 text-green-400 hover:border-green-400"
                      : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
                    }`}
                >
                  {isDone ? (
                    <CheckCircle size={14} className="text-green-400 shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-current shrink-0 text-[10px] flex items-center justify-center font-bold">
                      {mod.order}
                    </span>
                  )}
                  <span className="max-w-[140px] truncate">{mod.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tab bar ────────────────────────────────────────────────────────── */}
      <div className="flex gap-4 mb-8 border-b border-gray-700 overflow-x-auto">
        {[
          { id: "video",       icon: <PlayCircle size={18} />,    label: "Video Lesson"  },
          { id: "forum",       icon: <MessageSquare size={18} />, label: "Course Forum"  },
          { id: "quiz",        icon: <CheckCircle size={18} />,   label: "Final Quiz"    },
          { id: "certificate", icon: <Award size={18} />,         label: "Certificate"   },
        ].map(({ id, icon, label }) => {
          const isActive = activeTab === id;
          const isCert = id === "certificate";
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap flex items-center gap-2
                ${isActive
                  ? isCert ? "border-yellow-500 text-yellow-400" : "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
            >
              {icon} {label}
            </button>
          );
        })}
      </div>

      {/* ══════════════════ VIDEO TAB ══════════════════════════════════════ */}
      {activeTab === "video" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video + overview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black rounded-xl overflow-hidden shadow-xl border border-gray-800">
              {videoUrl ? (
                <video
                  key={currentModule?._id}
                  ref={videoRef}
                  controls
                  className="w-full aspect-video outline-none"
                  src={videoUrl}
                  poster="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1080&auto=format&fit=crop"
                  onTimeUpdate={savePosition}
                  onEnded={handleVideoEnded}
                />
              ) : (
                <div className="w-full aspect-video flex items-center justify-center bg-gray-900">
                  <p className="text-gray-500">No video available for this module.</p>
                </div>
              )}
            </div>
            <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-2">Lesson Overview</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                {videoOverview || "No overview provided for this module."}
              </p>
            </div>
          </div>

          {/* Bookmarks sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-800 h-full flex flex-col shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BookmarkPlus size={20} className="text-blue-400" /> My Bookmarks
              </h3>

              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
                {bookmarks.length === 0 ? (
                  <p className="text-gray-500 text-sm italic text-center mt-10">
                    No bookmarks yet. Play the video and add one!
                  </p>
                ) : (
                  bookmarks.map((bm) => (
                    <div
                      key={bm.id}
                      onClick={() => jumpToTime(bm.time)}
                      className="bg-[#0f172a] p-3 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer group"
                    >
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit mb-1 group-hover:bg-blue-500 transition-colors">
                        <PlayCircle size={10} /> {formatTime(bm.time)}
                      </span>
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
                  placeholder="Note at current time…"
                  className="flex-1 bg-[#0f172a] text-white text-sm px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm font-semibold"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ FORUM TAB ══════════════════════════════════════ */}
      {activeTab === "forum" && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1f2937] p-6 rounded-xl shadow-xl border border-gray-800 flex flex-col h-[600px]">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                Discussion: {moduleTitle}
              </h2>
              <span className="text-sm text-gray-400">{forumPosts.length} posts</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2">
              {forumPosts.length === 0 && (
                <p className="text-gray-500 text-sm italic text-center mt-10">
                  No posts yet. Be the first to ask a question!
                </p>
              )}
              {forumPosts.map((post) => (
                <div key={post._id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 bg-blue-600 text-sm">
                    {(post.author?.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-200">{post.author?.name || "Student"}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm bg-[#0f172a] p-4 rounded-xl rounded-tl-none border border-gray-700 inline-block max-w-lg">
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
                placeholder="Ask a question or help a classmate…"
                className="w-full bg-[#0f172a] text-white pl-4 pr-12 py-4 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button type="submit" className="absolute right-3 top-3 text-blue-500 hover:text-blue-400 p-1">
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════ QUIZ TAB ═══════════════════════════════════════ */}
      {activeTab === "quiz" && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#1f2937] p-8 rounded-xl shadow-xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-2">Module Quiz</h2>
            <p className="text-gray-400 mb-8 border-b border-gray-700 pb-6">
              Score {passingScore}% or higher to unlock your certificate.
            </p>

            {questions.length === 0 ? (
              <p className="text-gray-400 text-center py-10">
                No quiz available for this module yet.
              </p>
            ) : (
              <>
                <div className="space-y-8">
                  {questions.map((q, qIndex) => (
                    <div key={q._id || qIndex} className="bg-[#0f172a] p-6 rounded-xl border border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-200 mb-4">
                        <span className="text-blue-500 mr-2">Q{qIndex + 1}.</span>
                        {q.question}
                      </h3>
                      <div className="space-y-3">
                        {q.options.map((opt, oIndex) => {
                          const isSelected = selectedAnswers[qIndex] === oIndex;
                          let style = "border-gray-600 hover:border-blue-400 text-gray-300";
                          if (isSelected && !quizSubmitted) style = "border-blue-500 bg-blue-900/20 text-white";
                          if (quizSubmitted) {
                            // After submission, show correct answer using server-provided index
                            // The server doesn't return correctAnswer, so highlight selected only
                            if (isSelected) {
                              style = quizPassed
                                ? "border-green-500 bg-green-900/20 text-green-300"
                                : "border-red-500 bg-red-900/20 text-red-300";
                            } else {
                              style = "border-gray-700 text-gray-600 opacity-50";
                            }
                          }
                          return (
                            <div
                              key={oIndex}
                              onClick={() => handleAnswerSelect(qIndex, oIndex)}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${style}`}
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
                  <div className={`mt-8 p-6 rounded-xl border text-center ${quizPassed ? "bg-green-900/20 border-green-500" : "bg-red-900/20 border-red-500"}`}>
                    <h3 className={`text-2xl font-bold mb-2 ${quizPassed ? "text-green-400" : "text-red-400"}`}>
                      You scored {quizScore} out of {questions.length}!
                    </h3>
                    {quizPassed ? (
                      <p className="text-gray-300">
                        You passed! Your certificate is now unlocked. 🎉
                      </p>
                    ) : (
                      <>
                        <p className="text-gray-400 mb-4">
                          You need {passingScore}% to pass. Try reviewing the video and attempt again.
                        </p>
                        <button
                          onClick={() => { setQuizSubmitted(false); setSelectedAnswers({}); }}
                          className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                          Try Again
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={submitQuiz}
                    disabled={Object.keys(selectedAnswers).length < questions.length}
                    className={`mt-8 w-full py-4 rounded-xl font-bold text-lg transition-colors shadow-lg ${
                      Object.keys(selectedAnswers).length === questions.length
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Submit Answers
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════ CERTIFICATE TAB ═══════════════════════════════ */}
      {activeTab === "certificate" && (
        <div className="max-w-4xl mx-auto">
          {quizPassed ? (
            <div className="flex flex-col items-center">
              {/* Printable certificate */}
              <div
                id="certificate"
                className="bg-[#f8f9fa] w-full aspect-[1.414/1] relative p-10 shadow-2xl overflow-hidden rounded-sm flex items-center justify-center text-center"
              >
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

                  <p className="text-gray-600 italic mb-4 text-lg">has successfully completed</p>

                  <h3 className="text-3xl text-[#1e3a8a] font-semibold mb-12">
                    {courseTitle}
                  </h3>

                  <div className="flex justify-between w-3/4 mt-8 border-t border-gray-400 pt-4">
                    <div>
                      <p className="text-black font-bold">{instructorName}</p>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">Lead Instructor</p>
                    </div>
                    <div>
                      <p className="text-black font-bold">
                        {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">Date Completed</p>
                    </div>
                  </div>
                </div>

                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <Award size={400} />
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:-translate-y-1"
              >
                <Download size={20} /> Print / Save as PDF
              </button>
            </div>
          ) : (
            <div className="bg-[#1f2937] p-12 rounded-xl border border-gray-800 text-center flex flex-col items-center justify-center h-[500px]">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={40} className="text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Certificate Locked</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Complete the module video and score {passingScore}% or higher on the Final Quiz
                to unlock your personalised certificate of completion.
              </p>
              <button
                onClick={() => setActiveTab("quiz")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
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
