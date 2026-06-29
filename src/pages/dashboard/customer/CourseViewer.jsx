import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Download,
  Award,
  Video,
  FileText,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import SEO from "../../../components/SEO";
import {
  useGetEnrollmentQuery,
  useToggleLessonCompletionMutation,
} from "../../../redux/slices/enrollmentApiSlice";
import ErrorMessage from "../../../components/common/ErrorMessage";

const CourseViewer = () => {
  const { courseId } = useParams();
  const { data, isLoading, isError, refetch } = useGetEnrollmentQuery(courseId);
  const [toggleCompletion, { isLoading: isToggling }] = useToggleLessonCompletionMutation();

  const [activeLesson, setActiveLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    refetch();
  }, [refetch, courseId]);

  const enrollment = data?.data;
  const course = enrollment?.courseId;

  // Set default active lesson on load
  useEffect(() => {
    if (course?.sections && !activeLesson) {
      // Find the first lesson in the curriculum
      for (const section of course.sections) {
        if (section.lessons && section.lessons.length > 0) {
          setActiveLesson(section.lessons[0]);
          break;
        }
      }
    }
  }, [course, activeLesson]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-slate-600 text-sm font-medium">Loading Course Curriculum...</p>
      </div>
    );
  }

  if (isError || !enrollment) {
    return <ErrorMessage error={"Could not load course. Please check if you have purchased it."} />;
  }

  // Calculate overall progress
  const totalLessons = course.sections?.reduce((acc, sec) => acc + (sec.lessons?.length || 0), 0) || 0;
  const completedLessonsList = enrollment.completedLessons || [];
  const completedCount = completedLessonsList.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Parse video URL to return embeddable formats
  const getMediaSource = (url) => {
    if (!url) return null;
    
    // YouTube Matches
    let youtubeMatch = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i);
    if (youtubeMatch) {
      return { type: "iframe", url: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=0&rel=0` };
    }
    
    // Vimeo Matches
    let vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
    if (vimeoMatch) {
      return { type: "iframe", url: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=0` };
    }
    
    // Direct link or S3
    if (url.match(/\.(mp4|webm|ogg)$/i) || url.includes("s3.amazonaws.com")) {
      return { type: "video", url };
    }
    
    // Return standard link if it can be embedded or rendered fallback
    return { type: "link", url };
  };

  const currentMedia = activeLesson ? getMediaSource(activeLesson.videoUrl) : null;
  const isLessonCompleted = (lessonId) => completedLessonsList.includes(lessonId);

  // Toggle lesson completion handler
  const handleToggleLesson = async (lessonId) => {
    try {
      const response = await toggleCompletion({ courseId, lessonId }).unwrap();
      
      // If the lesson is now completed and it was the last one, show celebration
      const updatedCompleted = response?.data?.completedLessons || [];
      if (updatedCompleted.length === totalLessons && !completedLessonsList.includes(lessonId)) {
        setShowCelebration(true);
      }
    } catch (err) {
      console.error("Failed to toggle completion status:", err);
    }
  };

  // Find next and previous lessons for navigation
  const getNavigationLessons = () => {
    const flatLessons = [];
    course.sections.forEach((sec) => {
      sec.lessons.forEach((les) => {
        flatLessons.push(les);
      });
    });

    const currentIndex = flatLessons.findIndex((les) => les._id === activeLesson?._id);
    return {
      prev: currentIndex > 0 ? flatLessons[currentIndex - 1] : null,
      next: currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null,
    };
  };

  const { prev: prevLesson, next: nextLesson } = getNavigationLessons();

  return (
    <>
      <SEO
        title={`${course.title} - Learning Player`}
        description={`Taking course ${course.title}`}
        name="BookStore"
        type="ecommerce"
      />

      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 bg-slate-900 bg-opacity-80 backdrop-blur-md flex items-center justify-center p-4 transition-all animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden border border-purple-100">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Congratulations! 🎉</h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              You have successfully completed all the lessons in <strong className="text-slate-800">{course.title}</strong>! Keep up the amazing work on your learning journey.
            </p>
            <button
              onClick={() => setShowCelebration(false)}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-md"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}

      {/* Course Player Layout */}
      <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-slate-50 border border-slate-200 rounded-xl shadow-xs">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto">
          {/* Header toolbar */}
          <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard/courses"
                className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                title="Back to my courses"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </Link>
              <div>
                <h1 className="font-bold text-slate-800 text-sm sm:text-base truncate max-w-xs sm:max-w-md">
                  {course.title}
                </h1>
                <p className="text-slate-400 text-xxs mt-0.5">Instructor: {course.author}</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 flex items-center gap-1.5 text-xs font-semibold"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              {sidebarOpen ? "Hide Curriculum" : "Show Curriculum"}
            </button>
          </div>

          {/* Lesson Screen Area */}
          <div className="p-6 flex-1 max-w-4xl mx-auto w-full space-y-6">
            {activeLesson ? (
              <>
                {/* Media Player Container */}
                <div className="bg-black rounded-2xl overflow-hidden shadow-md aspect-video relative group">
                  {currentMedia ? (
                    currentMedia.type === "iframe" ? (
                      <iframe
                        src={currentMedia.url}
                        className="w-full h-full border-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={activeLesson.title}
                      ></iframe>
                    ) : currentMedia.type === "video" ? (
                      <video
                        src={currentMedia.url}
                        className="w-full h-full"
                        controls
                        controlsList="nodownload"
                      ></video>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 p-8 text-center bg-slate-900">
                        <Video className="h-16 w-16 text-slate-500 mb-4" />
                        <p className="text-sm font-semibold">External Video File Provided</p>
                        <a
                          href={currentMedia.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all"
                        >
                          Watch External Video
                        </a>
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 p-8 text-center bg-slate-900">
                      <FileText className="h-16 w-16 text-slate-500 mb-4" />
                      <p className="text-sm font-semibold">Content-only Lesson</p>
                      <p className="text-slate-500 text-xs mt-1 max-w-xs">
                        This lesson does not contain a lecture video. Read the study materials below.
                      </p>
                    </div>
                  )}
                </div>

                {/* Lesson Header Title & Completion Check */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xxs">
                  <div>
                    <span className="text-purple-600 text-xxs font-bold uppercase tracking-wider">
                      Now playing
                    </span>
                    <h2 className="text-xl font-bold text-slate-800 mt-0.5">{activeLesson.title}</h2>
                    {activeLesson.duration && (
                      <span className="text-slate-400 text-xs mt-1 block">⏱ Lesson length: {activeLesson.duration}</span>
                    )}
                  </div>
                  
                  <button
                    disabled={isToggling}
                    onClick={() => handleToggleLesson(activeLesson._id)}
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs border cursor-pointer transition-all ${
                      isLessonCompleted(activeLesson._id)
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {isLessonCompleted(activeLesson._id) ? (
                      <>
                        <CheckCircle className="h-4.5 w-4.5 fill-current" />
                        Completed
                      </>
                    ) : (
                      <>
                        <div className="h-4.5 w-4.5 rounded-full border-2 border-slate-400"></div>
                        Mark as Complete
                      </>
                    )}
                  </button>
                </div>

                {/* Lesson Details/Content */}
                {activeLesson.content && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xxs">
                    <h3 className="font-bold text-slate-800 text-sm mb-3">Study Notes & Materials</h3>
                    <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                      {activeLesson.content}
                    </div>
                  </div>
                )}

                {/* PDF Attachments Download widget */}
                {activeLesson.pdfUrl && (
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex justify-between items-center shadow-xxs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900 text-xs sm:text-sm">Lesson Resources</p>
                        <p className="text-blue-700 text-xxs">PDF guide and downloadable study files</p>
                      </div>
                    </div>
                    <a
                      href={activeLesson.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download PDF
                    </a>
                  </div>
                )}

                {/* Bottom Navigation Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <button
                    disabled={!prevLesson}
                    onClick={() => setActiveLesson(prevLesson)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous Lesson
                  </button>
                  <button
                    disabled={!nextLesson}
                    onClick={() => setActiveLesson(nextLesson)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center gap-1.5 shadow-xs"
                  >
                    Next Lesson
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white border border-dashed rounded-2xl border-slate-300">
                <BookOpen className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-700">No lessons available</h3>
                <p className="text-slate-500 text-sm">This course does not contain any curriculum lessons.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Navigation Panel (Sections / Lessons) */}
        {sidebarOpen && (
          <div className="w-80 h-full bg-white border-l border-slate-200 flex flex-col justify-between shrink-0">
            <div>
              {/* Progress Panel */}
              <div className="p-5 border-b border-slate-200">
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-slate-700">Course Progress</span>
                  <span className="text-purple-600">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-slate-400 text-xxs font-semibold mt-1">
                  {completedCount} of {totalLessons} lessons completed
                </p>
              </div>

              {/* Sections list menu */}
              <div className="overflow-y-auto max-h-[calc(100vh-210px)] p-2 space-y-3">
                {course.sections.map((section, sIdx) => (
                  <div key={section._id || sIdx} className="space-y-1">
                    <h4 className="text-xxs font-bold text-slate-400 uppercase tracking-wider px-3 pt-2">
                      Section {sIdx + 1}: {section.title}
                    </h4>
                    <div className="space-y-0.5 mt-1">
                      {section.lessons.map((lesson) => {
                        const isCurrent = activeLesson?._id === lesson._id;
                        const isDone = isLessonCompleted(lesson._id);

                        return (
                          <button
                            key={lesson._id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-2.5 text-xs transition-all ${
                              isCurrent
                                ? "bg-purple-50 text-purple-700 font-bold border-l-4 border-purple-600 pl-2"
                                : "text-slate-600 hover:bg-slate-50 font-medium"
                            }`}
                          >
                            <span className="mt-0.5 shrink-0">
                              {isDone ? (
                                <CheckCircle className="h-4 w-4 text-emerald-500 fill-current" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border border-slate-300 bg-white"></div>
                              )}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="truncate leading-tight">{lesson.title}</p>
                              {lesson.duration && (
                                <span className="text-xxs text-slate-400 block mt-0.5 font-normal">
                                  ⏱ {lesson.duration}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Widget */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xxs text-slate-500">
              <span className="flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5 text-purple-500" />
                Curriculum syllabus
              </span>
              <span>v1.0.0</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseViewer;
