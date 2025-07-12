// SinglePostPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom"; // Assuming you use React Router
import {
  useGetPostByIdQuery,
  useLikeUnlikePostMutation,
  useAddCommentToPostMutation,
  useDeleteCommentFromPostMutation,
} from "../redux/slices/postsApiSlice";
import { useGetUserDashboardQuery } from "../redux/slices/authSlice";
import { BookOpen, ArrowLeft } from "lucide-react"; // Import icons
import PostCard from "../components/dashboard/PostCard";
import SEO from "../components/SEO";

const SinglePostPage = () => {
  const { postId } = useParams(); // Get postId from the URL parameters
  const navigate = useNavigate(); // For navigation back

  // Fetch the single post
  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError,
  } = useGetPostByIdQuery(postId);

  // Fetch current user data (needed for PostCard interactions like likes/comments)
  const {
    data: currentUser,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useGetUserDashboardQuery();

  // Bring in mutations needed by PostCard from this level
  const [likeUnlikePost] = useLikeUnlikePostMutation();
  const [addComment] = useAddCommentToPostMutation();
  const [deleteComment] = useDeleteCommentFromPostMutation();

  const isLoading = isPostLoading || isUserLoading;
  const isError = isPostError || isUserError;
  const error = postError || userError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-md">
          <div className="text-red-500 mb-4">
            <BookOpen size={48} className="mx-auto mb-2" />
            <p className="text-lg font-semibold">Error Loading Post</p>
          </div>
          <p className="text-gray-600 mb-6">
            {error?.data?.message ||
              "Something went wrong while loading the post."}
            <br /> It might not exist or there was a network issue.
          </p>
          <button
            onClick={() => navigate(-1)} // Go back to the previous page
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-md">
          <div className="text-gray-500 mb-4">
            <BookOpen size={48} className="mx-auto mb-2" />
            <p className="text-lg font-semibold">Post Not Found</p>
          </div>
          <p className="text-gray-600 mb-6">
            The post you are looking for does not exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <SEO
        title={post.content?.text}
        description={post.content?.text}
        image={post.content?.imageUrl}
      />
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Feed
        </button>

        {post && currentUser && (
          <PostCard
            post={post}
            onLike={likeUnlikePost}
            onComment={addComment}
            onDeleteComment={deleteComment}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};

export default SinglePostPage;
