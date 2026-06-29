import React from "react";
import { Link } from "react-router-dom";
import { useGetBlogsQuery } from "../../redux/slices/blogApiSlice";

function LatestNews() {
  const { data, isLoading } = useGetBlogsQuery({ page: 1, limit: 4 });
  const liveBlogs = data?.data || [];

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="h-8 w-48 bg-slate-100 animate-pulse rounded mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-150 p-4 space-y-3 animate-pulse">
                <div className="h-32 bg-slate-200 rounded-lg"></div>
                <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Gracefully auto-hide the homepage blog section if no articles have been published yet
  if (liveBlogs.length === 0) {
    return null;
  }

  const postsToDisplay = liveBlogs.slice(0, 4).map((b) => ({
    id: b._id,
    title: b.title,
    author: b.authorName,
    avatar: b.author?.avatar || "",
    date: new Date(b.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    image: b.imageUrl,
  }));

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Latest News</h2>
          <Link to="/blogs" className="text-sm font-bold text-purple-700 hover:text-purple-900 transition-colors">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {postsToDisplay.map((post) => {
            const authorAvatar = post.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80";

            return (
              <Link
                key={post.id}
                to={`/blogs/${post.id}`}
                className="bg-white rounded-xl shadow-xs border border-slate-150 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="h-32 bg-slate-100 overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-xs text-slate-800 line-clamp-2 mb-3 group-hover:text-purple-650 transition-colors leading-relaxed">
                      {post.title}
                    </h3>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-2 flex items-center border-t border-slate-50">
                  <img
                    src={authorAvatar}
                    alt={post.author}
                    className="w-6 h-6 rounded-full mr-2 object-cover border border-slate-200"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-700 truncate leading-none">{post.author}</p>
                    <span className="text-[9px] text-slate-400 mt-0.5 block">{post.date}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Link to="/blogs" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-sm transition-colors">
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}

export default LatestNews;
