import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedPosts, createPost, likePost, addComment } from '../../features/social/socialSlice';
import PostCard from '../../components/social/PostCard';
import CreatePostForm from '../../components/social/CreatePostForm';
import SocialSidebar from '../../components/social/SocialSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { initSocket, socket } from '../../sockets/socket';

const SocialFeed = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { posts, status, error } = useSelector((state) => state.social);
  const [newPost, setNewPost] = useState('');
  const [commentTexts, setCommentTexts] = useState({});

  useEffect(() => {
    dispatch(fetchFeedPosts());
    
    // Initialize socket connection
    initSocket();
    
    // Listen for new posts
    socket.on('newPost', (post) => {
      dispatch({ type: 'social/addPost', payload: post });
    });
    
    // Listen for post likes
    socket.on('postLiked', (updatedPost) => {
      dispatch({ type: 'social/updatePost', payload: updatedPost });
    });
    
    // Listen for new comments
    socket.on('newComment', ({ postId, comment }) => {
      dispatch({ type: 'social/addComment', payload: { postId, comment } });
    });
    
    return () => {
      socket.off('newPost');
      socket.off('postLiked');
      socket.off('newComment');
    };
  }, [dispatch]);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      dispatch(createPost({ content: newPost, userId: user._id }));
      setNewPost('');
    }
  };

  const handleLike = (postId) => {
    dispatch(likePost({ postId, userId: user._id }));
  };

  const handleCommentSubmit = (postId) => {
    if (commentTexts[postId]?.trim()) {
      dispatch(addComment({
        postId,
        userId: user._id,
        content: commentTexts[postId],
      }));
      setCommentTexts({ ...commentTexts, [postId]: '' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-3/4">
          <h1 className="text-3xl font-bold mb-6">Social Feed</h1>
          
          <CreatePostForm 
            newPost={newPost}
            setNewPost={setNewPost}
            handlePostSubmit={handlePostSubmit}
          />
          
          {status === 'loading' ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold">No posts yet</h3>
              <p>Be the first to share something!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={user?._id}
                  commentText={commentTexts[post._id] || ''}
                  setCommentText={(text) => setCommentTexts({ ...commentTexts, [post._id]: text })}
                  onLike={() => handleLike(post._id)}
                  onCommentSubmit={() => handleCommentSubmit(post._id)}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="md:w-1/4">
          <SocialSidebar />
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;