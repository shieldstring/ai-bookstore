import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Send,
  TrendingUp,
  Calendar,
  MoreHorizontal,
  Star,
  Edit,
  Trash2,
  Flag,
  Bookmark,
} from "lucide-react";
import {
  useLikeUnlikeCommentMutation,
  useReplyCommentMutation,
  useDeletePostMutation,
  useReportPostMutation,
  useToggleSavePostMutation,
  useEditPostMutation,
} from "../../redux/slices/postsApiSlice";
import { useNavigate } from "react-router-dom";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

const commentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const likeVariants = {
  scale: [1, 1.2, 1],
  transition: {
    duration: 0.3,
    ease: "easeInOut",
  },
};

// Modal component for editing with animations
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg sm:text-xl font-bold mb-4">Edit Post</h2>
          <motion.textarea
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            rows="4"
            placeholder="Edit your post content..."
          />
          <motion.input
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            type="url"
            value={editImageUrl}
            onChange={(e) => setEditImageUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Edit image URL (optional)"
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
              disabled={!editText.trim() && !editImageUrl}
            >
              Save Changes
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
  const [isEditing, setIsEditing] = useState(false);

  const moreMenuRef = useRef(null);

  const [likeUnlikeComment] = useLikeUnlikeCommentMutation();
  const [replyComment] = useReplyCommentMutation();
  const [deletePost] = useDeletePostMutation();
  const [reportPost] = useReportPostMutation();
  const [toggleSavePost] = useToggleSavePostMutation();
  const [editPost] = useEditPostMutation();

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
    setIsEditing(true);
    setShowMoreMenu(false);
  };

  const handleSaveEditedPost = async (updatedPostData) => {
    try {
      await editPost(updatedPostData).unwrap();
      console.log("Post updated successfully!");
    } catch (error) {
      console.error("Error updating post:", error);
      alert(`Failed to update post: ${error?.data?.message || error.message}`);
    } finally {
      setIsEditing(false);
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
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium ${
          colors[tier] || colors[0]
        }`}
      >
        T{tier}
      </motion.span>
    );
  };

  const renderComments = (commentList, level = 0) => {
    if (!commentList || commentList.length === 0) return null;

    return commentList.map((comment, index) => (
      <motion.div
        key={comment._id}
        variants={commentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ delay: index * 0.1 }}
        className={`p-3 sm:p-4 border-b border-gray-50 last:border-b-0 ${
          level > 0 ? "ml-4 sm:ml-8 bg-gray-50 rounded-lg my-2" : ""
        }`}
      >
        <div className="flex gap-2 sm:gap-3">
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            src={
              comment.user?.profilePicture ||
              `https://ui-avatars.com/api/?name=${comment.user?.name}&background=3B82F6&color=fff`
            }
            alt={comment.user?.name}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-100 rounded-2xl px-3 py-2 sm:px-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-xs sm:text-sm text-gray-900 truncate">
                  {comment.user?.name}
                </p>
                {comment.user?.mlmTier && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex-shrink-0"
                  >
                    T{comment.user.mlmTier}
                  </motion.span>
                )}
              </div>
              <p
                className="text-gray-800 text-xs sm:text-sm break-words"
                dangerouslySetInnerHTML={{
                  __html: processText(comment.text),
                }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 sm:gap-4 mt-2 text-xs"
            >
              <span className="text-gray-500">
                {formatTime(comment.createdAt)}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLikeUnlikeComment(comment._id)}
                className={`transition-colors flex items-center gap-1 ${
                  comment.likes?.includes(currentUser?._id)
                    ? "text-red-500 hover:text-red-700"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                <motion.div
                  animate={
                    comment.likes?.includes(currentUser?._id)
                      ? likeVariants
                      : {}
                  }
                >
                  <Heart
                    size={10}
                    className={`sm:w-3 sm:h-3 ${
                      comment.likes?.includes(currentUser?._id)
                        ? "fill-current"
                        : ""
                    }`}
                  />
                </motion.div>
                <span className="hidden sm:inline">Like</span> ({comment.likes?.length || 0})
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setReplyingTo(comment._id);
                  setCommentText(`@${comment.user?.name} `);
                }}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Reply
              </motion.button>
              {(comment.user?._id === currentUser?._id ||
                post.user?._id === currentUser?._id) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  Delete
                </motion.button>
              )}
            </motion.div>

            <AnimatePresence>
              {replyingTo === comment._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col sm:flex-row gap-2 mt-3 overflow-hidden"
                >
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={`Replying to ${comment.user?.name}...`}
                    className="flex-1 px-3 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-xs sm:text-sm"
                  />
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReplyComment(comment._id)}
                      disabled={!commentText.trim()}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setReplyingTo(null);
                        setCommentText("");
                      }}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-full text-xs"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {comment.replies && comment.replies.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-3"
              >
                {renderComments(comment.replies, level + 1)}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    ));
  };

  const navigate = useNavigate();
  const handlePostClick = () => {
    navigate(`/feeds/${post._id}`);
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
      >
        {/* Post Header */}
        <div className="p-4 sm:p-6 pb-3 sm:pb-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-1 min-w-0"
              onClick={handlePostClick}
            >
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                src={
                  post.user?.profilePicture ||
                  `https://ui-avatars.com/api/?name=${post.user?.name}&background=3B82F6&color=fff`
                }
                alt={post.user?.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <motion.h3
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-semibold text-gray-900 text-sm sm:text-base truncate"
                  >
                    {post.user?.name}
                  </motion.h3>
                  {getUserTierBadge(post.user)}
                </div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500"
                >
                  <Calendar size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                  <span>{formatTime(post.createdAt)}</span>
                  {post.user?.level && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <div className=" items-center gap-1 hidden sm:flex">
                        <Star size={12} />
                        <span>Level {post.user.level}</span>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
            {/* More Button and Dropdown */}
            <div className="relative flex-shrink-0" ref={moreMenuRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreHorizontal size={18} className="text-gray-500" />
              </motion.button>
              <AnimatePresence>
                {showMoreMenu && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-44 sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1"
                  >
                    {currentUser?._id === post.user?._id && (
                      <>
                        <motion.button
                          whileHover={{ backgroundColor: "#f3f4f6" }}
                          onClick={handleEditPost}
                          className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-gray-700 text-sm"
                        >
                          <Edit size={14} /> Edit Post
                        </motion.button>
                        <motion.button
                          whileHover={{ backgroundColor: "#f3f4f6" }}
                          onClick={handleDeletePost}
                          className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-red-600 text-sm"
                        >
                          <Trash2 size={14} /> Delete Post
                        </motion.button>
                      </>
                    )}
                    <motion.button
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      onClick={handleReportPost}
                      className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-gray-700 text-sm"
                    >
                      <Flag size={14} /> Report Post
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      onClick={handleToggleSavePost}
                      className="flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-gray-700 text-sm"
                    >
                      <Bookmark
                        size={14}
                        className={isSaved ? "fill-current text-blue-500" : ""}
                      />
                      {isSaved ? "Unsave Post" : "Save Post"}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-4 sm:px-6 pb-3 sm:pb-4 cursor-pointer"
          onClick={handlePostClick}
        >
          {post.content?.text && (
            <p
              className="text-gray-800 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base break-words"
              dangerouslySetInnerHTML={{
                __html: processText(post.content.text),
              }}
            />
          )}

          {post.content?.imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-3 sm:mb-4"
            >
              <img
                src={post.content.imageUrl}
                alt="Post content"
                className="w-full rounded-xl object-cover max-h-80 sm:max-h-96"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Post Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isLiked ? likeVariants : {}}
                onClick={handleLike}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition-colors text-sm ${
                  isLiked
                    ? "text-red-600 bg-red-50 hover:bg-red-100"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Heart size={16} className={`sm:w-5 sm:h-5 ${isLiked ? "fill-current" : ""}`} />
                <span className="font-medium">{likesCount}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors text-sm"
              >
                <MessageCircle size={16} className="sm:w-5 sm:h-5" />
                <span className="font-medium">{comments.length}</span>
              </motion.button>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSharePost}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <TrendingUp size={14} className="sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Share</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-100 overflow-hidden"
            >
              {/* Comment Input for new top-level comment */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-3 sm:p-4 border-b border-gray-100"
              >
                <div className="flex gap-2 sm:gap-3">
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    src={currentUser?.profilePicture}
                    alt={currentUser?.name}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 flex gap-2">
                    <motion.input
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="flex-1 px-3 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleComment}
                      disabled={!commentText.trim()}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={14} className="sm:w-4 sm:h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Comments List */}
              <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                {comments.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-gray-500 py-6 text-sm"
                  >
                    No comments yet. Be the first to comment!
                  </motion.p>
                ) : (
                  <AnimatePresence>
                    {renderComments(comments)}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Edit Post Modal */}
      <AnimatePresence>
        {isEditing && (
          <EditPostModal
            post={post}
            onClose={() => setIsEditing(false)}
            onSave={handleSaveEditedPost}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PostCard;