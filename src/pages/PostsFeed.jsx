import React, { useState } from "react";
import { BookOpen, ShoppingCart, Bookmark } from "lucide-react";
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start gap-4">
        <img
          src={currentUser.profilePicture}
          alt={currentUser.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Share your thoughts about books, recommendations, or experiences..."
            className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={isExpanded ? 4 : 2}
          />

          {isExpanded && (
            <div className="mt-4 space-y-3">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Add image URL (optional)"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <BookOpen size={16} />
                  <span>Share book recommendations & reviews</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      setPostText("");
                      setImageUrl("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || (!postText.trim() && !imageUrl)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? "Posting..." : "Share"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PostsFeed = () => {
  const [limit] = useState(10);
  const [skip] = useState(0);
  const [showSavedPosts, setShowSavedPosts] = useState(false); // State to toggle between all and saved posts

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
  } = useGetPostsQuery({ limit, skip }, { skip: showSavedPosts }); // Skip if showing saved posts

  // Query for saved posts
  const {
    data: savedPosts = [],
    isLoading: areSavedPostsLoading,
    isError: isSavedPostsError,
    error: savedPostsError,
  } = useGetSavedPostsQuery(undefined, { skip: !showSavedPosts }); // Skip if not showing saved posts

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community posts...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <BookOpen size={48} className="mx-auto mb-2" />
            <p className="text-lg font-semibold">Error Loading Posts</p>
          </div>
          <p className="text-gray-600 mb-4">
            {error?.data?.message ||
              "Something went wrong while loading the community feed or user data."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="text-blue-600" size={28} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {showSavedPosts ? "Saved Posts" : "Community Feed"}
                </h1>
                <p className="text-sm text-gray-600">
                  {showSavedPosts
                    ? "Your bookmarked posts"
                    : "Connect, share, and discover books together"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSavedPosts(!showSavedPosts)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  showSavedPosts
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                <Bookmark
                  size={16}
                  className={showSavedPosts ? "fill-current" : "text-blue-600"}
                />
                <span className="text-sm font-medium">
                  {showSavedPosts
                    ? "View All Posts"
                    : `View Saved (${currentUser?.savedPosts?.length || 0})`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {!showSavedPosts && ( // Only show Create Post Card in general feed
            <CreatePostCard
              onCreatePost={createPost}
              currentUser={currentUser}
            />
          )}

          {/* Posts Feed */}
          {postsToDisplay.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {showSavedPosts ? "No saved posts yet." : "No posts yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {showSavedPosts
                  ? "Save posts by clicking the 'More' menu on any post and selecting 'Save Post'."
                  : "Be the first to share a book recommendation or start a discussion!"}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <ShoppingCart size={16} />
                <span>
                  Share your favorite books • Connect with readers • Earn
                  rewards
                </span>
              </div>
            </div>
          ) : (
            postsToDisplay.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onLike={likeUnlikePost}
                onComment={addComment}
                onDeleteComment={deleteComment}
                currentUser={currentUser}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostsFeed;
