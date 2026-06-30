import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetCoursesQuery } from "../../redux/slices/courseApiSlice";
import { BookOpen, Star, Video, FileText, ArrowRight } from "lucide-react";
import FormattedPrice from "../common/FormattedPrice";

export default function FeaturedCourses() {
  const { currency } = useSelector((state) => state.currency);
  const { data, isLoading } = useGetCoursesQuery({ page: 1, limit: 4, currency });
  const courses = data?.data || [];

  if (isLoading) {
    return (
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="h-8 w-60 bg-slate-200 animate-pulse rounded mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-150 p-4 space-y-3 animate-pulse">
                <div className="h-40 bg-slate-200 rounded-xl"></div>
                <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
                <div className="h-3 w-2/3 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Hide the section if no courses exist in the database
  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-slate-50 border-y border-slate-200/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Featured Online Courses
            </h2>
            <p className="text-slate-500 text-xs mt-1">Upgrade your skills with curriculum-based online video lectures</p>
          </div>
          <Link
            to="/courses"
            className="text-sm font-bold text-purple-700 hover:text-purple-900 transition-colors flex items-center gap-1"
          >
            Explore All Courses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.slice(0, 4).map((course) => {
            const totalSections = course.sections?.length || 0;
            const totalLessons = course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;
            const rating = course.averageRating || 4.8;

            return (
              <div
                key={course._id}
                className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  {/* Image cover */}
                  <div className="h-40 bg-slate-100 relative overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                      {course.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-extrabold text-slate-800 text-sm line-clamp-2 min-h-[2.5rem] group-hover:text-purple-650 transition-colors">
                      <Link to={`/courses/${course._id}`}>{course.title}</Link>
                    </h3>
                    <p className="text-slate-500 text-xs">Instructor: {course.author}</p>

                    {/* Stats & Rating */}
                    <div className="flex items-center justify-between text-xxs text-slate-400 font-medium pt-1">
                      <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        <Video className="h-3 w-3 text-purple-650" />
                        {totalLessons} Lectures
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer price and call to action */}
                <div className="px-5 pb-5 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <FormattedPrice
                      price={course.price}
                      originalPrice={course.originalPrice}
                      className="text-slate-800 font-extrabold text-base"
                      priceIsConverted
                    />
                  </div>
                  <Link
                    to={`/courses/${course._id}`}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xxs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    View Syllabus
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
