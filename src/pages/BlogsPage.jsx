import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetBlogsQuery } from "../redux/slices/blogApiSlice";
import ErrorMessage from "../components/common/ErrorMessage";
import SEO from "../components/SEO";
import PageHero from "../components/common/PageHero";
import { Calendar, User, Search, ArrowRight, BookOpen } from "lucide-react";

export default function BlogsPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const limit = 6;
  const { data, isLoading, isError, refetch } = useGetBlogsQuery({
    page,
    limit,
    category,
    search: searchQuery,
    showDrafts: false, // Customers only see published posts
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
    { value: "", label: "All Topics" },
    { value: "General", label: "General" },
    { value: "Tips", label: "Tips & Tricks" },
    { value: "Benefits", label: "Benefits of Reading" },
    { value: "Lists", label: "Book Lists" },
    { value: "Mental Health", label: "Mental Health" },
    { value: "Industry News", label: "Industry News" },
  ];

  if (isError) {
    return <ErrorMessage error="Could not load blog posts. Please check back later." />;
  }

  const blogs = data?.data || [];
  const totalPages = data?.pages || 1;

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO
        title="Bookstore Blogs & Articles"
        description="Explore Bookstore's official news, lists, mental health benefits, and reading guides."
        name="BookStore"
        type="website"
      />

      <PageHero
        eyebrow="Insights & Inspiration"
        title="Blogs"
        subtitle="Guides, benefits of reading, book summaries, and industry news from Wisdom Peters."
        backgroundImage="/pI 1.png"
        overlayClass="bg-gradient-to-br from-black/80 via-purple-950/75 to-black/85"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Blogs" },
        ]}
      />

      <div className="container mx-auto px-4 max-w-6xl py-12 -mt-2 relative z-10">
        {/* Filters and Search toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          {/* Category Chips */}
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

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80 order-1 md:order-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 bg-white rounded-full w-full text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </form>
        </div>

        {/* Articles list */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse space-y-3">
                <div className="h-44 w-full bg-slate-200 rounded-xl"></div>
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
                <div className="h-6 w-full bg-slate-200 rounded"></div>
                <div className="h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed rounded-3xl border-slate-300">
            <BookOpen className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No articles found</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
              We couldn't find any blog posts matching your search query. Try clearing your filters or testing other topics!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div>
                    {/* Cover Photo */}
                    <div className="h-48 bg-slate-100 relative overflow-hidden">
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-4 left-4 bg-purple-600 text-white text-xxs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {blog.category}
                      </span>
                    </div>

                    <div className="p-6">
                      <h2 className="font-extrabold text-slate-800 text-base md:text-lg mt-1 line-clamp-2 min-h-[3.25rem] group-hover:text-purple-600 transition-colors">
                        <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
                      </h2>
                      <p className="text-slate-500 text-xs mt-3 line-clamp-3 leading-relaxed">
                        {blog.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-purple-50 rounded-full flex items-center justify-center border border-purple-100 text-purple-600">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700 text-xxs leading-tight">{blog.authorName}</p>
                        <p className="text-slate-400 text-[10px] mt-0.5 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/blogs/${blog._id}`}
                      className="text-purple-600 hover:text-purple-800 font-bold text-xs inline-flex items-center gap-1 group/btn"
                    >
                      Read
                      <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
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
                        : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
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
