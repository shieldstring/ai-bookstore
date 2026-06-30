import React, { useEffect, useState } from "react";
import { BookOpen, Search, Play, Award } from "lucide-react";
import SEO from "../../../components/SEO";
import { Link } from "react-router-dom";
import LoadingSkeleton from "../../../components/preloader/LoadingSkeleton";
import { useGetMyEnrollmentsQuery } from "../../../redux/slices/enrollmentApiSlice";
import ErrorMessage from "../../../components/common/ErrorMessage";

const MyCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError, refetch } = useGetMyEnrollmentsQuery();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    refetch();
  }, [refetch]);

  const enrollments = data?.data || [];

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const course = enrollment.courseId;
    if (!course) return false;
    return (
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="h-6 w-48 bg-slate-200 animate-pulse rounded mb-6"></div>
        <LoadingSkeleton type={"list"} count={3} />
      </div>
    );
  }

  if (isError) {
    return <ErrorMessage error={"Error loading your courses. Please try again."} />;
  }

  return (
    <>
      <SEO
        title="My Courses"
        description="Your enrolled online courses and progress"
        name="BookStore"
        type="ecommerce"
      />
      <div className="bg-white rounded-xl shadow-sm p-6 min-h-[70vh]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">My Courses</h2>
            <p className="text-slate-500 text-xs mt-1">Access your curriculum and track your learning progress</p>
          </div>
          <div className="relative mt-4 md:mt-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search my courses..."
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-md w-full md:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredEnrollments.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">
              {searchTerm ? "No matching courses found" : "No courses enrolled yet"}
            </h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto mb-6">
              {searchTerm
                ? "Try searching for another topic or course name"
                : "You haven't bought any online courses. Browse our store to unlock unlimited learning."}
            </p>
            {!searchTerm && (
              <Link
                to="/courses"
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-semibold text-sm transition-all shadow-md"
              >
                Browse Courses
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map((enrollment) => {
              const course = enrollment.courseId;
              if (!course) return null;

              // Calculate progress percentage
              const totalLessons = course.sections?.reduce((acc, sec) => acc + (sec.lessons?.length || 0), 0) || 0;
              const completedCount = enrollment.completedLessons?.length || 0;
              const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

              return (
                <div
                  key={enrollment._id}
                  className="bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div>
                    {/* Course Banner / Cover */}
                    <div className="h-40 bg-slate-100 relative overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link
                          to={`/dashboard/courses/${course._id}`}
                          className="p-3 bg-white bg-opacity-90 rounded-full text-purple-600 hover:scale-110 transition-transform shadow-lg"
                        >
                          <Play className="h-6 w-6 fill-current" />
                        </Link>
                      </div>
                      <span className="absolute top-3 right-3 bg-purple-600 text-white text-xxs font-bold px-2 py-0.5 rounded-full shadow-sm">
                        Course
                      </span>
                    </div>

                    <div className="p-5">
                      <span className="text-slate-400 text-xxs uppercase tracking-wider font-semibold">
                        {course.category}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm mt-1 line-clamp-2 min-h-[2.5rem] group-hover:text-purple-600 transition-colors">
                        <Link to={`/dashboard/courses/${course._id}`}>{course.title}</Link>
                      </h4>
                      <p className="text-slate-500 text-xs mt-1">Instructor: {course.author}</p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 border-t border-slate-50">
                    {/* Progress Slider */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Progress</span>
                        <span className="text-slate-800 font-bold flex items-center gap-1">
                          {progressPercentage}%
                          {progressPercentage === 100 && (
                            <Award className="h-3.5 w-3.5 text-emerald-500" />
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-slate-400 text-xxs font-medium">
                        {completedCount} of {totalLessons} lessons completed
                      </p>
                    </div>

                    {/* CTA Button */}
                    <Link
                      to={`/dashboard/courses/${course._id}`}
                      className="w-full py-2 bg-slate-50 hover:bg-purple-600 hover:text-white border border-slate-200 hover:border-purple-600 text-slate-700 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      {progressPercentage === 100 ? "Review Course" : progressPercentage > 0 ? "Resume Course" : "Start Course"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MyCourses;
