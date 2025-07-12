import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  BookOpen,
  Users,
  TrendingUp,
  User,
  Calendar,
  MoreHorizontal,
  Star,
  ShoppingCart,
  Edit,
  Trash2,
  Flag,
  Bookmark,
} from "lucide-react";
import {
  useGetPostsQuery,
  useCreatePostMutation,
  useLikeUnlikePostMutation,
  useAddCommentToPostMutation,
  useDeleteCommentFromPostMutation,
  useLikeUnlikeCommentMutation,
  useReplyCommentMutation,
  useDeletePostMutation,
  useGetSavedPostsQuery,
  useReportPostMutation,
  useToggleSavePostMutation,
  useEditPostMutation,
} from "../redux/slices/postsApiSlice";

import { useGetUserDashboardQuery } from "../redux/slices/authSlice";

// Modal component for editing (simplified)
const EditPostModal = ({ post, onClose, onSave }) => {
  const [editText, setEditText] = useState(post.content?.text || "");
  const [editImageUrl, setEditImageUrl] = useState(
    post.content?.imageUrl || ""
  );

  const handleSubmit = () => {
    onSave({
      id: post._id,
      content: {
        text: editText,
        imageUrl: editImageUrl || undefined,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Edit Post</h2>
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="6"
          placeholder="Edit your post content..."
        />
        <input
          type="url"
          value={editImageUrl}
          onChange={(e) => setEditImageUrl(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Edit image URL (optional)"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={!editText.trim() && !editImageUrl}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

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

const PostCard = ({
  post,
  onLike,
  onComment,
  onDeleteComment,
  currentUser,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(
    post.likes?.includes(currentUser?._id) || false
  );
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State for edit modal

  const moreMenuRef = useRef(null);

  const [likeUnlikeComment] = useLikeUnlikeCommentMutation();
  const [replyComment] = useReplyCommentMutation();
  const [deletePost] = useDeletePostMutation();
  const [reportPost] = useReportPostMutation(); // Destructure new mutation
  const [toggleSavePost] = useToggleSavePostMutation(); // Destructure new mutation
  const [editPost] = useEditPostMutation(); // Destructure new mutation

  // Effect to handle click outside for the More menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };

    if (showMoreMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMoreMenu]);

  // Check if the current user has saved this post
  // This would typically come from user dashboard data or a specific saved posts query
  const isSaved = currentUser?.savedPosts?.includes(post._id);

  const handleLike = async () => {
    try {
      await onLike(post._id).unwrap();
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      await onComment({ postId: post._id, text: commentText }).unwrap();
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await onDeleteComment({ postId: post._id, commentId }).unwrap();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleLikeUnlikeComment = async (commentId) => {
    try {
      await likeUnlikeComment({ postId: post._id, commentId }).unwrap();
    } catch (error) {
      console.error("Error liking/unliking comment:", error);
    }
  };

  const handleReplyComment = async (commentId) => {
    if (!commentText.trim()) return;

    try {
      await replyComment({
        postId: post._id,
        commentId: commentId,
        text: commentText,
      }).unwrap();
      setCommentText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error replying to comment:", error);
    }
  };

  const handleSharePost = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.content?.text?.substring(0, 50) || "Check out this post!",
          text: post.content?.text || "A new post from the community feed.",
          url: `${window.location.origin}/feeds/${post._id}`,
        });
        console.log("Post shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      const postUrl = `${window.location.origin}/feeds/${post._id}`;
      navigator.clipboard
        .writeText(postUrl)
        .then(() => alert("Post link copied to clipboard!"))
        .catch((err) => console.error("Could not copy text: ", err));
    }
    setShowMoreMenu(false);
  };

  const handleDeletePost = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      try {
        await deletePost(post._id).unwrap();
        console.log("Post deleted successfully!");
      } catch (error) {
        console.error("Error deleting post:", error);
        alert(
          `Failed to delete post: ${error?.data?.message || error.message}`
        );
      } finally {
        setShowMoreMenu(false);
      }
    }
  };

  const handleEditPost = () => {
    setIsEditing(true); // Open the edit modal
    setShowMoreMenu(false); // Close the more menu
  };

  const handleSaveEditedPost = async (updatedPostData) => {
    try {
      await editPost(updatedPostData).unwrap();
      console.log("Post updated successfully!");
    } catch (error) {
      console.error("Error updating post:", error);
      alert(`Failed to update post: ${error?.data?.message || error.message}`);
    } finally {
      setIsEditing(false); // Close the edit modal
    }
  };

  const handleReportPost = async () => {
    if (window.confirm("Are you sure you want to report this post?")) {
      try {
        await reportPost(post._id).unwrap();
        alert("Post reported successfully!");
      } catch (error) {
        console.error("Error reporting post:", error);
        alert(
          `Failed to report post: ${error?.data?.message || error.message}`
        );
      } finally {
        setShowMoreMenu(false);
      }
    }
  };

  const handleToggleSavePost = async () => {
    try {
      await toggleSavePost(post._id).unwrap();
      alert(isSaved ? "Post unsaved!" : "Post saved!");
    } catch (error) {
      console.error("Error saving/unsaving post:", error);
      alert(
        `Failed to save/unsave post: ${error?.data?.message || error.message}`
      );
    } finally {
      setShowMoreMenu(false);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  const processText = (text) => {
    if (!text) return "";

    let processedText = text.replace(
      /#(\w+)/g,
      '<span class="text-blue-600 font-medium cursor-pointer hover:underline">#$1</span>'
    );

    processedText = processedText.replace(
      /@\[([^\]]+)\]\([^)]+\)/g,
      '<span class="text-blue-600 font-medium cursor-pointer hover:underline">@$1</span>'
    );

    return processedText;
  };

  const getUserTierBadge = (user) => {
    const tier = user.mlmTier || 0;
    const colors = {
      0: "bg-gray-100 text-gray-700",
      1: "bg-green-100 text-green-700",
      2: "bg-blue-100 text-blue-700",
      3: "bg-purple-100 text-purple-700",
      4: "bg-yellow-100 text-yellow-700",
      5: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[tier] || colors[0]
        }`}
      >
        Tier {tier}
      </span>
    );
  };

  const renderComments = (commentList, level = 0) => {
    if (!commentList || commentList.length === 0) return null;

    return commentList.map((comment) => (
      <div
        key={comment._id}
        className={`p-4 border-b border-gray-50 last:border-b-0 ${
          level > 0 ? "ml-8 bg-gray-50 rounded-lg my-2" : ""
        }`}
      >
        <div className="flex gap-3">
          <img
            src={
              comment.user?.profilePicture ||
              `https://ui-avatars.com/api/?name=${comment.user?.name}&background=3B82F6&color=fff`
            }
            alt={comment.user?.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="bg-gray-100 rounded-2xl px-4 py-2">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-sm text-gray-900">
                  {comment.user?.name}
                </p>
                {comment.user?.mlmTier && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Tier {comment.user.mlmTier}
                  </span>
                )}
              </div>
              <p
                className="text-gray-800 text-sm"
                dangerouslySetInnerHTML={{
                  __html: processText(comment.text),
                }}
              />
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs text-gray-500">
                {formatTime(comment.createdAt)}
              </span>
              <button
                onClick={() => handleLikeUnlikeComment(comment._id)}
                className={`text-xs transition-colors flex items-center gap-1 ${
                  comment.likes?.includes(currentUser?._id)
                    ? "text-red-500 hover:text-red-700"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                <Heart
                  size={12}
                  className={
                    comment.likes?.includes(currentUser?._id)
                      ? "fill-current"
                      : ""
                  }
                />
                Like ({comment.likes?.length || 0})
              </button>
              <button
                onClick={() => {
                  setReplyingTo(comment._id);
                  setCommentText(`@${comment.user?.name} `);
                }}
                className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                Reply
              </button>
              {(comment.user?._id === currentUser?._id ||
                post.user?._id === currentUser?._id) && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>

            {replyingTo === comment._id && (
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={`Replying to ${comment.user?.name}...`}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                />
                <button
                  onClick={() => handleReplyComment(comment._id)}
                  disabled={!commentText.trim()}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setCommentText("");
                  }}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  Cancel
                </button>
              </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3">
                {renderComments(comment.replies, level + 1)}
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        {/* Post Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={
                  post.user?.profilePicture ||
                  `https://ui-avatars.com/api/?name=${post.user?.name}&background=3B82F6&color=fff`
                }
                alt={post.user?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {post.user?.name}
                  </h3>
                  {getUserTierBadge(post.user)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  <span>{formatTime(post.createdAt)}</span>
                  {post.user?.level && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Star size={14} />
                        <span>Level {post.user.level}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* More Button and Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreHorizontal size={20} className="text-gray-500" />
              </button>
              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                  {currentUser?._id === post.user?._id && (
                    <>
                      <button
                        onClick={handleEditPost}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <Edit size={16} /> Edit Post
                      </button>
                      <button
                        onClick={handleDeletePost}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        <Trash2 size={16} /> Delete Post
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleReportPost}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <Flag size={16} /> Report Post
                  </button>
                  <button
                    onClick={handleToggleSavePost}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <Bookmark
                      size={16}
                      className={isSaved ? "fill-current text-blue-500" : ""}
                    />{" "}
                    {isSaved ? "Unsave Post" : "Save Post"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="px-6 pb-4">
          {post.content?.text && (
            <p
              className="text-gray-800 mb-4 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: processText(post.content.text),
              }}
            />
          )}

          {post.content?.imageUrl && (
            <div className="mb-4">
              <img
                src={post.content.imageUrl}
                alt="Post content"
                className="w-full rounded-xl object-cover max-h-96"
              />
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
                  isLiked
                    ? "text-red-600 bg-red-50 hover:bg-red-100"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Heart size={20} className={isLiked ? "fill-current" : ""} />
                <span className="font-medium">{likesCount}</span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <MessageCircle size={20} />
                <span className="font-medium">{comments.length}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSharePost}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <TrendingUp size={18} />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-gray-100">
            {/* Comment Input for new top-level comment */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex gap-3">
                <img
                  src={currentUser?.profilePicture}
                  alt={currentUser?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  <button
                    onClick={handleComment}
                    disabled={!commentText.trim()}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="max-h-96 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                renderComments(comments)
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Post Modal */}
      {isEditing && (
        <EditPostModal
          post={post}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveEditedPost}
        />
      )}
    </>
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
