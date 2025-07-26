import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetFollowersQuery,
  useGetFollowingQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useCheckFollowStatusQuery,
  useGetSuggestedUsersQuery,
} from "../../../redux/slices/followApiSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserCheck,
  UserPlus,
  UserMinus,
  ChevronLeft,
  User,
  Search,
} from "lucide-react";
import SEO from "../../../components/SEO";

const FollowDashboard = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("followers");
  const [searchQuery, setSearchQuery] = useState("");

  // Use 'me' if no userId specified (current user)
  const targetUserId = userId || "me";

  // Fetch data with proper array fallbacks
  const {
    data: followersResponse = {},
    isLoading: followersLoading,
    refetch: refetchFollowers,
  } = useGetFollowersQuery(targetUserId);
  const followers =
    followersResponse?.followers ||
    followersResponse?.data ||
    followersResponse ||
    [];

  const {
    data: followingResponse = {},
    isLoading: followingLoading,
    refetch: refetchFollowing,
  } = useGetFollowingQuery(targetUserId);
  const following =
    followingResponse?.following ||
    followingResponse?.data ||
    followingResponse ||
    [];

  const {
    data: suggestedResponse = {},
    isLoading: suggestedLoading,
    refetch: refetchSuggested,
  } = useGetSuggestedUsersQuery();
  const suggestedUsers =
    suggestedResponse?.suggested ||
    suggestedResponse?.data ||
    suggestedResponse ||
    [];

  // Check follow status
  const { data: followStatus } = useCheckFollowStatusQuery(userId || null, {
    skip: !userId,
  });
  const isFollowingProfile = userId ? followStatus?.isFollowing : false;

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  // Filter functions with array checks
  const filterUsers = (users, query) => {
    if (!Array.isArray(users)) return [];
    return users.filter(
      (user) =>
        user?.name?.toLowerCase().includes(query.toLowerCase()) ||
        user?.username?.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filteredFollowers = filterUsers(followers, searchQuery);
  const filteredFollowing = filterUsers(following, searchQuery);
  const filteredSuggested = filterUsers(suggestedUsers, searchQuery);

  // Animation variants
  const tabVariants = {
    active: {
      backgroundColor: "#9333ea",
      color: "#ffffff",
    },
    inactive: {
      backgroundColor: "#f3f4f6",
      color: "#4b5563",
    },
  };

  const userCardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const handleFollowAction = async (targetId, isCurrentlyFollowing) => {
    try {
      if (isCurrentlyFollowing) {
        await unfollowUser(targetId).unwrap();
      } else {
        await followUser(targetId).unwrap();
      }
      // Refetch all relevant data
      refetchFollowers();
      refetchFollowing();
      refetchSuggested();
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const renderUserCard = (user, isFollowingList = false) => {
    // For the current user's following list, show unfollow button
    const showUnfollow = isFollowingList && targetUserId === "me";
    const isCurrentUser = user._id === targetUserId;

    return (
      <motion.div
        key={user._id}
        variants={userCardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
        className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <img
          src={
            user.profilePicture ||
            `https://ui-avatars.com/api/?name=${user.name}&background=random`
          }
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover mr-3 cursor-pointer"
          onClick={() => navigate(`/users/${user._id}`)}
        />
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => navigate(`/users/${user._id}`)}
        >
          <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
          <p className="text-sm text-gray-500 truncate">@{user.username}</p>
          {user.bio && (
            <p className="text-xs text-gray-400 mt-1 truncate">{user.bio}</p>
          )}
        </div>
        {!isCurrentUser && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFollowAction(user._id, showUnfollow);
            }}
            className={`ml-2 p-2 rounded-full flex items-center gap-1 ${
              showUnfollow
                ? "text-red-600 hover:bg-red-50"
                : "text-purple-600 hover:bg-purple-50"
            }`}
          >
            {showUnfollow ? <UserMinus size={18} /> : <UserPlus size={18} />}
            <span className="text-xs hidden sm:inline">
              {showUnfollow ? "Unfollow" : "Follow"}
            </span>
          </button>
        )}
      </motion.div>
    );
  };

  const renderEmptyState = (tab) => {
    const icons = {
      followers: <Users size={48} className="mx-auto mb-3 text-gray-300" />,
      following: <UserCheck size={48} className="mx-auto mb-3 text-gray-300" />,
      suggested: <UserPlus size={48} className="mx-auto mb-3 text-gray-300" />,
    };

    const messages = {
      followers: userId
        ? "This user has no followers yet"
        : "You have no followers yet",
      following: userId
        ? "This user is not following anyone yet"
        : "You are not following anyone yet",
      suggested: "No suggestions available",
    };

    return (
      <div className="text-center py-8 text-gray-500">
        {icons[tab]}
        <p>{messages[tab]}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${userId ? "User Connections" : "My Connections"} | Social App`}
        description={`View ${activeTab} on Social App`}
      />

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 mr-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {userId ? "User Connections" : "My Connections"}
            </h1>
          </div>

          {/* Follow button when viewing someone else's profile */}
          {userId && (
            <button
              onClick={() => handleFollowAction(userId, isFollowingProfile)}
              className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                isFollowingProfile
                  ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {isFollowingProfile ? (
                <>
                  <UserMinus size={16} /> Unfollow
                </>
              ) : (
                <>
                  <UserPlus size={16} /> Follow
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-purple-600">
              {followers.length}
            </div>
            <div className="text-sm text-gray-500">Followers</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-purple-600">
              {following.length}
            </div>
            <div className="text-sm text-gray-500">Following</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search connections..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <motion.button
            animate={activeTab === "followers" ? "active" : "inactive"}
            variants={tabVariants}
            onClick={() => setActiveTab("followers")}
            className="flex-1 py-2 px-4 rounded-full text-sm font-medium flex items-center justify-center gap-2"
          >
            <Users size={16} /> Followers
          </motion.button>
          <motion.button
            animate={activeTab === "following" ? "active" : "inactive"}
            variants={tabVariants}
            onClick={() => setActiveTab("following")}
            className="flex-1 py-2 px-4 rounded-full text-sm font-medium flex items-center justify-center gap-2"
          >
            <UserCheck size={16} /> Following
          </motion.button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "followers" && (
              <div className="space-y-3">
                {followersLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading followers...
                  </div>
                ) : filteredFollowers.length === 0 ? (
                  renderEmptyState("followers")
                ) : (
                  filteredFollowers.map((user) => renderUserCard(user, false))
                )}
              </div>
            )}

            {activeTab === "following" && (
              <div className="space-y-3">
                {followingLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading following...
                  </div>
                ) : filteredFollowing.length === 0 ? (
                  renderEmptyState("following")
                ) : (
                  filteredFollowing.map((user) => renderUserCard(user, true))
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Suggested Section */}
      <div className="max-w-4xl mx-auto px-4 py-6 bg-white mt-6 rounded-t-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <UserPlus size={20} /> Suggested for you
        </h2>
        <div className="space-y-3">
          {suggestedLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading suggestions...
            </div>
          ) : filteredSuggested.length === 0 ? (
            renderEmptyState("suggested")
          ) : (
            filteredSuggested.map((user) => renderUserCard(user, false))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowDashboard;
