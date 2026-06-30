import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetBlogDetailsQuery } from "../redux/slices/blogApiSlice";
import ErrorMessage from "../components/common/ErrorMessage";
import SEO from "../components/SEO";
import PageHero from "../components/common/PageHero";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";

export default function BlogDetailPage() {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useGetBlogDetailsQuery(id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    refetch();
  }, [refetch, id]);

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen py-12 flex justify-center">
        <div className="w-full max-w-3xl px-4 space-y-6">
          <div className="h-6 w-32 bg-slate-200 animate-pulse rounded"></div>
          <div className="h-80 w-full bg-slate-200 animate-pulse rounded-2xl"></div>
          <div className="h-10 w-3/4 bg-slate-200 animate-pulse rounded"></div>
          <div className="h-4 w-1/2 bg-slate-200 animate-pulse rounded"></div>
          <div className="space-y-2 pt-4">
            <div className="h-4 w-full bg-slate-200 animate-pulse rounded"></div>
            <div className="h-4 w-full bg-slate-200 animate-pulse rounded"></div>
            <div className="h-4 w-5/6 bg-slate-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return <ErrorMessage error="Blog post details could not be found or loaded." />;
  }

  const blog = data.data;

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO
        title={blog.title}
        description={blog.summary}
        name="BookStore"
        type="article"
      />

      <PageHero
        variant="compact"
        eyebrow={blog.category}
        title={blog.title}
        subtitle={blog.summary}
        backgroundImage={blog.imageUrl}
        align="left"
        overlayClass="bg-gradient-to-r from-black/88 via-purple-950/82 to-black/75"
        minHeight="min-h-[260px] md:min-h-[300px]"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Blogs", to: "/blogs" },
          { label: blog.title?.length > 36 ? `${blog.title.slice(0, 36)}…` : blog.title },
        ]}
      />

      <div className="container mx-auto px-4 max-w-3xl py-10 -mt-2 relative z-10">
        <Link
          to="/blogs"
          className="inline-flex items-center text-slate-500 hover:text-purple-600 font-semibold text-sm transition-colors gap-2 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blogs
        </Link>

        <article className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden p-6 md:p-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-slate-100">
            <span className="bg-purple-50 text-purple-700 font-bold px-3 py-1 rounded-full text-xxs uppercase tracking-wider border border-purple-100">
              {blog.category}
            </span>
            <span className="text-slate-400 text-xxs font-semibold flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {blog.readTime}
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <div className="h-8 w-8 bg-purple-50 rounded-full flex items-center justify-center border border-purple-100 text-purple-600">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-slate-700 text-xs">{blog.authorName}</p>
                <p className="text-slate-400 text-xxs flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(blog.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Summary Quote excerpt */}
          <div className="p-4 bg-slate-50 border-l-4 border-purple-500 rounded-r-xl text-slate-650 text-sm font-medium italic leading-relaxed">
            {blog.summary}
          </div>

          {/* Body Content */}
          <div className="text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-line space-y-4">
            {blog.content}
          </div>

          {/* Call to action card */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-6 mt-10 text-center">
            <h3 className="font-bold text-purple-900 text-sm md:text-base">Love our bookstore blogs?</h3>
            <p className="text-slate-600 text-xs mt-1.5 max-w-md mx-auto">
              Check out our extensive catalog of paperbacks, hardcovers, e-books, and online course curriculums!
            </p>
            <div className="mt-4">
              <Link
                to="/books"
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                Browse Books & Courses
              </Link>
            </div>
          </div>

        </article>
      </div>
    </div>
  );
}
