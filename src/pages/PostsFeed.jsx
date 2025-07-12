import React, { useEffect, useState } from "react";
import { BookOpen, ShoppingCart, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetPostsQuery,
  useCreatePostMutation,
  useLikeUnlikePostMutation,
  useAddCommentToPostMutation,
  useDeleteCommentFromPostMutation,
  useGetSavedPostsQuery,
} from "../redux/slices/postsApiSlice";

import { useGetUserDashboardQuery } from "../redux/slices/authSlice";
import PostCard from "../components/dashboard/PostCard";

const CreatePostCard = ({ onCreatePost, currentUser }) => {
  const [postText, setPostText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!postText.trim() && !imageUrl) return;

    setIsSubmitting(true);
    try {
      const postData = {
        content: {
          text: postText,
          imageUrl: imageUrl || undefined,
        },
      };

      await onCreatePost(postData).unwrap();
      setPostText("");
      setImageUrl("");
      setIsExpanded(false);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          src={currentUser.profilePicture}
          alt={currentUser.name}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <motion.textarea
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Share your thoughts about books, recommendations, or experiences..."
            className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            rows={isExpanded ? 4 : 2}
          />

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-3"
              >
                <motion.input
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Add image URL (optional)"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0"
                >
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <BookOpen size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    </motion.div>
                    <span className="truncate">
                      Share book recommendations & reviews
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsExpanded(false);
                        setPostText("");
                        setImageUrl("");
                      }}
                      className="px-3 py-2 sm:px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmit}
                      disabled={isSubmitting || (!postText.trim() && !imageUrl)}
                      className="px-4 py-2 sm:px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      {isSubmitting ? "Posting..." : "Share"}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const PostsFeed = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const [limit] = useState(10);
  const [skip] = useState(0);
  const [showSavedPosts, setShowSavedPosts] = useState(false);

  // Fetch current user data (includes savedPosts array)
  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useGetUserDashboardQuery();

  // Query for all posts
  const {
    data: posts = [],
    isLoading: arePostsLoading,
    isError: isPostsError,
    error: postsError,
  } = useGetPostsQuery({ limit, skip }, { skip: showSavedPosts });

  // Query for saved posts
  const {
    data: savedPosts = [],
    isLoading: areSavedPostsLoading,
    isError: isSavedPostsError,
    error: savedPostsError,
  } = useGetSavedPostsQuery(undefined, { skip: !showSavedPosts });

  const [createPost] = useCreatePostMutation();
  const [likeUnlikePost] = useLikeUnlikePostMutation();
  const [addComment] = useAddCommentToPostMutation();
  const [deleteComment] = useDeleteCommentFromPostMutation();

  const postsToDisplay = showSavedPosts ? savedPosts : posts;
  const isLoading = isUserLoading || arePostsLoading || areSavedPostsLoading;
  const isError = isPostsError || userError || isSavedPostsError;
  const error = postsError || userError || savedPostsError;

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
            Loading community posts...
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
            <BookOpen size={48} className="mx-auto mb-2" />
            <p className="text-lg font-semibold">Error Loading Posts</p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 mb-4 text-sm sm:text-base"
          >
            {error?.data?.message ||
              "Something went wrong while loading the community feed or user data."}
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
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
        <div className="max-w-2xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <BookOpen className="text-blue-600 flex-shrink-0" size={24} />
              </motion.div>
              <div className="min-w-0 flex-1">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-lg sm:text-2xl font-bold text-gray-900 truncate"
                >
                  {showSavedPosts ? "Saved Posts" : "Community Feed"}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xs sm:text-sm text-gray-600 hidden sm:block"
                >
                  {showSavedPosts
                    ? "Your bookmarked posts"
                    : "Connect, share, and discover books together"}
                </motion.p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onClick={() => setShowSavedPosts(!showSavedPosts)}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg transition-colors ${
                  showSavedPosts
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                <motion.div
                  animate={showSavedPosts ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Bookmark
                    size={14}
                    className={`sm:w-4 sm:h-4 flex-shrink-0 ${
                      showSavedPosts ? "fill-current" : "text-blue-600"
                    }`}
                  />
                </motion.div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                  {showSavedPosts
                    ? "View All Posts"
                    : `View Saved (${currentUser?.savedPosts?.length || 0})`}
                </span>
                <span className="text-xs font-medium sm:hidden">
                  {showSavedPosts ? "All" : "Saved"}
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6"
      >
        <div className="space-y-4 sm:space-y-6">
          <AnimatePresence mode="wait">
            {!showSavedPosts && (
              <CreatePostCard
                onCreatePost={createPost}
                currentUser={currentUser}
              />
            )}
          </AnimatePresence>

          {/* Posts Feed */}
          <AnimatePresence mode="wait">
            {postsToDisplay.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8 sm:py-12 px-4"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <BookOpen
                    size={40}
                    className="sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4"
                  />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-base sm:text-lg font-medium text-gray-900 mb-2"
                >
                  {showSavedPosts ? "No saved posts yet." : "No posts yet"}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-sm sm:text-base text-gray-600 mb-4 max-w-md mx-auto"
                >
                  {showSavedPosts
                    ? "Save posts by clicking the 'More' menu on any post and selecting 'Save Post'."
                    : "Be the first to share a book recommendation or start a discussion!"}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500"
                >
                  <ShoppingCart
                    size={14}
                    className="sm:w-4 sm:h-4 flex-shrink-0"
                  />
                  <span className="text-center">
                    Share your favorite books • Connect with readers • Earn
                    rewards
                  </span>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="posts-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 sm:space-y-6"
              >
                {postsToDisplay.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    whileHover={{ y: -5 }}
                  >
                    <PostCard
                      post={post}
                      onLike={likeUnlikePost}
                      onComment={addComment}
                      onDeleteComment={deleteComment}
                      currentUser={currentUser}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default PostsFeed;