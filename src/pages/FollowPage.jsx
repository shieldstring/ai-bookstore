import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetFollowersQuery,
  useGetFollowingQuery,
  useCheckFollowStatusQuery,
  useGetSuggestedUsersQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../redux/slices/followApiSlice";
import { motion } from "framer-motion";
import {
  UserPlus,
  UserMinus,
  Users,
  UserCheck,
  ChevronLeft,
} from "lucide-react";
import SEO from "../components/SEO";

const FollowPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("followers");
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch data based on active tab
  const { data: followers, isLoading: followersLoading } =
    useGetFollowersQuery(userId);
  const { data: following, isLoading: followingLoading } =
    useGetFollowingQuery(userId);
  const { data: suggestedUsers, refetch: refetchSuggested } =
    useGetSuggestedUsersQuery();
  const { data: followStatus } = useCheckFollowStatusQuery(userId);
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  // Update follow status when data loads
  useEffect(() => {
    if (followStatus) {
      setIsFollowing(followStatus.isFollowing);
    }
  }, [followStatus]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(userId).unwrap();
        setIsFollowing(false);
      } else {
        await followUser(userId).unwrap();
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const handleFollowUser = async (targetUserId) => {
    try {
      await followUser(targetUserId).unwrap();
      refetchSuggested(); // Refresh suggestions after follow
      if (activeTab === "following") {
        // Refetch following list if needed
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const renderUserCard = (user) => (
    <motion.div
      key={user._id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50"
    >
      <div
        className="flex items-center gap-3 cursor-pointer flex-1"
        onClick={() => navigate(`/users/${user._id}`)}
      >
        <img
          src={
            user.profilePicture ||
            `https://ui-avatars.com/api/?name=${user.name}&background=random`
          }
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-medium text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
      </div>
      {user._id !== userId && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFollowUser(user._id);
          }}
          className="px-3 py-1 text-sm rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center gap-1"
        >
          <UserPlus size={14} /> Follow
        </button>
      )}
    </motion.div>
  );

  const renderContent = () => {
    if (activeTab === "followers") {
      if (followersLoading)
        return <div className="py-8 text-center">Loading followers...</div>;
      if (!followers?.length)
        return (
          <div className="py-8 text-center text-gray-500">No followers yet</div>
        );
      return followers.map(renderUserCard);
    }

    if (activeTab === "following") {
      if (followingLoading)
        return <div className="py-8 text-center">Loading following...</div>;
      if (!following?.length)
        return (
          <div className="py-8 text-center text-gray-500">
            Not following anyone yet
          </div>
        );
      return following.map(renderUserCard);
    }

    if (activeTab === "suggested") {
      if (!suggestedUsers?.length)
        return (
          <div className="py-8 text-center text-gray-500">
            No suggestions available
          </div>
        );
      return suggestedUsers.map(renderUserCard);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen">
      <SEO
        title={`${
          activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
        } | Social App`}
        description={`View ${activeTab} on Social App`}
      />

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">
            {activeTab === "followers" && "Followers"}
            {activeTab === "following" && "Following"}
            {activeTab === "suggested" && "Suggested Users"}
          </h1>
        </div>

        {/* Follow toggle for profile owner */}
        {userId && (
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleFollowToggle}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                isFollowing
                  ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {isFollowing ? (
                <>
                  <UserMinus size={14} /> Unfollow
                </>
              ) : (
                <>
                  <UserPlus size={14} /> Follow
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("followers")}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-1 ${
            activeTab === "followers"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Users size={16} /> Followers
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-1 ${
            activeTab === "following"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <UserCheck size={16} /> Following
        </button>
        <button
          onClick={() => setActiveTab("suggested")}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-1 ${
            activeTab === "suggested"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <UserPlus size={16} /> Suggested
        </button>
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-100">{renderContent()}</div>
    </div>
  );
};

export default FollowPage;
