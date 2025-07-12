import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Bookmark,
  ArrowLeft,
  Heart,
  MessageCircle,
  Search,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useGetSavedPostsQuery,
  useLikeUnlikePostMutation,
  useAddCommentToPostMutation,
  useDeleteCommentFromPostMutation,
  useToggleSavePostMutation,
} from "../../redux/slices/postsApiSlice";
import { useGetUserDashboardQuery } from "../../redux/slices/authSlice";
import PostCard from "../../components/dashboard/PostCard";

const SavedPosts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, mostLiked
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // Fetch current user data
  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useGetUserDashboardQuery();

  // Fetch saved posts
  const {
    data: savedPosts = [],
    isLoading: areSavedPostsLoading,
    isError: isSavedPostsError,
    error: savedPostsError,
    refetch: refetchSavedPosts,
  } = useGetSavedPostsQuery();

  // Mutations
  const [likeUnlikePost] = useLikeUnlikePostMutation();
  const [addComment] = useAddCommentToPostMutation();
  const [deleteComment] = useDeleteCommentFromPostMutation();
  const [unsavePost] = useToggleSavePostMutation();

  // Filter and sort posts
  const filteredAndSortedPosts = React.useMemo(() => {
    let filtered = savedPosts.filter((post) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        post.content?.text?.toLowerCase().includes(searchLower) ||
        post.author?.name?.toLowerCase().includes(searchLower) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    });

    // Sort posts
    switch (sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "mostLiked":
        filtered.sort(
          (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
        );
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  }, [savedPosts, searchTerm, sortBy]);

  const handleUnsavePost = async (postId) => {
    try {
      await unsavePost(postId).unwrap();
      refetchSavedPosts();
    } catch (error) {
      console.error("Error unsaving post:", error);
    }
  };

  const isLoading = isUserLoading || areSavedPostsLoading;
  const isError = isSavedPostsError || userError;
  const error = savedPostsError || userError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 text-sm sm:text-base"
          >
            Loading your saved posts...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-sm mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-red-500 mb-4"
          >
            <Bookmark size={48} className="mx-auto mb-2" />
            <p className="text-lg font-semibold">Error Loading Saved Posts</p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 mb-4 text-sm sm:text-base"
          >
            {error?.data?.message ||
              "Something went wrong while loading your saved posts."}
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => refetchSavedPosts()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40"
      >
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </motion.button>

              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Bookmark
                    className="text-blue-600 flex-shrink-0 fill-current"
                    size={24}
                  />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-lg sm:text-2xl font-bold text-gray-900 truncate"
                  >
                    Saved Posts
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xs sm:text-sm text-gray-600 hidden sm:block"
                  >
                    {filteredAndSortedPosts.length} saved post
                    {filteredAndSortedPosts.length !== 1 ? "s" : ""} • Your
                    bookmarked content
                  </motion.p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg transition-colors ${
                  showFilters
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Filter size={16} className="flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                  Filters
                </span>
              </motion.button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="relative flex-1">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search saved posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="mostLiked">Most Liked</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6"
      >
        <AnimatePresence mode="wait">
          {filteredAndSortedPosts.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12 sm:py-16 px-4"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Bookmark
                      size={64}
                      className="mx-auto text-gray-300 fill-current"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center"
                  >
                    <Heart size={12} className="text-blue-600" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl sm:text-2xl font-bold text-gray-900 mb-3"
              >
                {searchTerm ? "No posts found" : "No saved posts yet"}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto leading-relaxed"
              >
                {searchTerm
                  ? `No saved posts match "${searchTerm}". Try adjusting your search terms.`
                  : "Start saving posts you want to read later. Click the bookmark icon on any post to save it here."}
              </motion.p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Browse Community Posts
                </motion.button>

                {searchTerm && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchTerm("")}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Clear Search
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="posts-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Results Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between text-sm text-gray-600 pb-2"
              >
                <span>
                  {searchTerm
                    ? `Found ${filteredAndSortedPosts.length} result${
                        filteredAndSortedPosts.length !== 1 ? "s" : ""
                      }`
                    : `${filteredAndSortedPosts.length} saved post${
                        filteredAndSortedPosts.length !== 1 ? "s" : ""
                      }`}
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {sortBy === "newest"
                    ? "Newest First"
                    : sortBy === "oldest"
                    ? "Oldest First"
                    : "Most Liked"}
                </span>
              </motion.div>

              {/* Posts Grid */}
              <div className="space-y-4 sm:space-y-6">
                {filteredAndSortedPosts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                    whileHover={{ y: -5 }}
                    className="relative"
                  >
                    <PostCard
                      post={post}
                      onLike={likeUnlikePost}
                      onComment={addComment}
                      onDeleteComment={deleteComment}
                      onUnsave={handleUnsavePost}
                      currentUser={currentUser}
                      showUnsaveOption={true}
                    />

                    {/* Saved Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                    >
                      <Bookmark size={10} className="fill-current" />
                      <span>Saved</span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SavedPosts;
