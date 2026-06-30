import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetCoursesQuery } from "../redux/slices/courseApiSlice";
import ErrorMessage from "../components/common/ErrorMessage";
import SEO from "../components/SEO";
import PageHero from "../components/common/PageHero";
import { formatPricePlain } from "../utils/currency";
import { Star, Video, Search, ArrowRight, BookOpen } from "lucide-react";

export default function CoursesPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const limit = 8;
  const { data, isLoading, isError, refetch } = useGetCoursesQuery({
    page,
    limit,
    category,
    search: searchQuery,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    refetch();
  }, [refetch, page, category, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(search);
    setPage(1);
  };

  const categories = [
    { value: "", label: "All Subjects" },
    { value: "Business & Economics", label: "Business & Economics" },
    { value: "Science & Technology", label: "Science & Tech" },
    { value: "Self Development", label: "Self Development" },
    { value: "IT & Software", label: "IT & Software" },
  ];

  if (isError) {
    return <ErrorMessage error="Could not load courses. Please check back later." />;
  }

  const courses = data?.data || [];
  const totalPages = data?.pages || 1;

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO
        title="Featured Online Courses"
        description="Browse professional video courses, learn from top-tier instructors, and earn rewards."
        name="AI Bookstore"
        type="website"
      />

      <PageHero
        eyebrow="Online Learning"
        title="Courses"
        subtitle="Acquire specialized knowledge and grow with structured, curriculum-based video courses."
        backgroundImage="/pI 1.png"
        overlayClass="bg-gradient-to-br from-black/78 via-purple-950/72 to-black/85"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Courses" },
        ]}
      />

      <div className="container mx-auto px-4 max-w-6xl py-12 -mt-2 relative z-10">
        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          {/* Category selection */}
          <div className="flex flex-wrap gap-2 order-2 md:order-1">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setCategory(cat.value);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                  category === cat.value
                    ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                    : "bg-white border-slate-250 text-slate-600 hover:border-slate-350 hover:bg-slate-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Keyword Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80 order-1 md:order-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search course titles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 bg-white rounded-full w-full text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </form>
        </div>

        {/* Courses list rendering */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-150 animate-pulse space-y-3">
                <div className="h-40 bg-slate-200 rounded-xl"></div>
                <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed rounded-3xl border-slate-300">
            <BookOpen className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No courses found</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
              We couldn't find any online courses matching your query. Check back soon for new releases!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course) => {
                const totalLessons = course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;
                const rating = course.averageRating || 4.7;

                return (
                  <div
                    key={course._id}
                    className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div>
                      {/* Image cover */}
                      <div className="h-40 bg-slate-155 relative overflow-hidden">
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
                          <span className="flex items-center gap-1 text-slate-650 bg-slate-100 px-2 py-0.5 rounded-full">
                            <Video className="h-3 w-3 text-purple-600" />
                            {totalLessons} Lectures
                          </span>
                          <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            {rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer price and CTA */}
                    <div className="px-5 pb-5 pt-3 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        <span className="text-slate-800 font-extrabold text-base">{formatPricePlain(course.price)}</span>
                        {course.originalPrice && course.originalPrice > course.price && (
                          <span className="line-through ml-2 text-xxs text-gray-400 font-normal">
                            {formatPricePlain(course.originalPrice)}
                          </span>
                        )}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-2 border border-slate-300 rounded-lg bg-white text-slate-500 disabled:opacity-40 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-9 w-9 text-xs font-bold rounded-lg transition-colors border cursor-pointer ${
                      page === i + 1
                        ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                        : "bg-white border-slate-300 text-gray-700 hover:bg-slate-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-2 border border-slate-300 rounded-lg bg-white text-slate-500 disabled:opacity-40 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
