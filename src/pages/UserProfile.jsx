import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../components/common/LoadingSpinner';
import UserCard from '../components/dashboard/UserCard';
// import { fetchUserProfile } from '../../features/social/socialSlice';
// import UserCard from './UserCard';
// import PostCard from '../social/PostCard';
// import LoadingSpinner from '../common/LoadingSpinner';

const UserProfile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { profile, posts, status, error } = useSelector((state) => state.social);
  
  useEffect(() => {
    // dispatch(fetchUserProfile(userId));
  }, [dispatch, userId]);

  if (status === 'loading') return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          {profile && <UserCard user={profile} isProfile />}
          
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="font-semibold mb-4">Reading Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Books Read</span>
                <span className="font-medium">{profile?.stats?.booksRead || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Currently Reading</span>
                <span className="font-medium">{profile?.stats?.currentlyReading || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Reading Streak</span>
                <span className="font-medium">{profile?.stats?.readingStreak || 0} days</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
            
            {posts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No posts yet
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div>
                    {/* <PostCard
                    key={post._id} 
                    post={post} 
                    currentUserId={profile?._id} 
                  />  */}
                  post
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;