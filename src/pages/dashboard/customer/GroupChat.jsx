import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetGroupDetailsQuery,
  useGetGroupDiscussionsQuery,
  useAddDiscussionMutation,
  useDeleteDiscussionMutation,
  useJoinGroupMutation,
  useLeaveGroupMutation,
} from "../../../redux/slices/groupApiSlice";
import { Send, ArrowLeft, Users, MoreVertical, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const GroupChat = () => {
  const { groupId } = useParams();
  const [message, setMessage] = useState("");
  const [showOptions, setShowOptions] = useState(null);
  const messagesEndRef = useRef(null);
  const { userInfo } = useSelector((state) => state.auth);

  // Fetch group details
  const {
    data: group = {},
    isLoading: isLoadingGroup,
    refetch: refetchGroup,
  } = useGetGroupDetailsQuery(groupId);

  // Fetch discussions
  const {
    data: discussions = [],
    isLoading: isLoadingDiscussions,
    isError: isErrorDiscussions,
    refetch: refetchDiscussions,
  } = useGetGroupDiscussionsQuery(groupId);

  // Mutations
  const [addDiscussion] = useAddDiscussionMutation();
  const [deleteDiscussion] = useDeleteDiscussionMutation();
  const [joinGroup] = useJoinGroupMutation();
  const [leaveGroup] = useLeaveGroupMutation();

  // Auto-scroll to bottom when discussions update
  useEffect(() => {
    scrollToBottom();
  }, [discussions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Check if user is a member of the group
  const isMember = group.members?.some((member) => member._id === userInfo._id);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const data = { groupId, message };
    try {
      await addDiscussion(data).unwrap();
      setMessage("");
      refetchDiscussions();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send message");
    }
  };

  // Handle joining/leaving group
  const handleGroupAction = async () => {
    try {
      if (isMember) {
        await leaveGroup(groupId).unwrap();
        toast.success("You have left the group");
      } else {
        await joinGroup(groupId).unwrap();
        toast.success("You have joined the group");
      }
      refetchGroup();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to perform action");
    }
  };

  // Handle deleting a discussion
  const handleDeleteDiscussion = async (discussionId) => {
    try {
      await deleteDiscussion(discussionId).unwrap();
      refetchDiscussions();
      toast.success("Discussion deleted");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete discussion");
    } finally {
      setShowOptions(null);
    }
  };

  if (isLoadingGroup) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="p-4 text-center">Loading group details...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/dashboard/chats" className="mr-3">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-200 overflow-hidden mr-3">
            {group.avatar ? (
              <img
                src={group.avatar}
                alt={group.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Users className="h-full w-full p-1.5 text-purple-400" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold capitalize">{group.name}</h2>
            <p className="text-sm text-gray-500">
              {group.members?.length || 0} members
            </p>
          </div>
        </div>
        <button
          onClick={handleGroupAction}
          className={`px-3 py-1 rounded-md text-sm ${
            isMember
              ? "bg-red-100 text-red-800 hover:bg-gray-200"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {isMember ? "Leave Group" : "Join Group"}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingDiscussions ? (
          <div className="text-center text-gray-500 py-4">
            Loading discussions...
          </div>
        ) : isErrorDiscussions ? (
          <div className="text-center text-gray-500 py-4">
            Error loading discussions
          </div>
        ) : discussions.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No discussions yet. Start the conversation!
          </div>
        ) : (
          discussions.map((discussion) => {
            const isCurrentUser = discussion.user?._id === userInfo._id;
            const isAdmin = userInfo._id === group.admin?._id;
            const canDelete = isCurrentUser || isAdmin;

            return (
              <div
                key={discussion._id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex max-w-[80%] relative">
                  {!isCurrentUser && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 overflow-hidden mr-2 mt-1">
                      {discussion.user?.avatar ? (
                        <img
                          src={discussion.user.avatar}
                          alt={discussion.user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-purple-500 text-white">
                          {discussion.user?.name?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    {!isCurrentUser && (
                      <p className="text-xs text-gray-500 mb-1">
                        {discussion.user?.name || "Unknown User"}
                      </p>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 break-words relative ${
                        isCurrentUser
                          ? "bg-purple-500 text-white"
                          : "bg-white border border-gray-200 text-gray-800"
                      }`}
                    >
                      <p>{discussion.message}</p>
                      {canDelete && (
                        <button
                          onClick={() =>
                            setShowOptions(
                              showOptions === discussion._id
                                ? null
                                : discussion._id
                            )
                          }
                          className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      )}
                      {showOptions === discussion._id && (
                        <div className="absolute right-0 top-6 bg-white shadow-lg rounded-md z-10">
                          <button
                            onClick={() =>
                              handleDeleteDiscussion(discussion._id)
                            }
                            className="flex items-center px-3 py-2 text-red-500 hover:bg-gray-100 w-full text-left"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(discussion.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Only show if user is a member */}
      {isMember && (
        <div className="border-t border-gray-200 p-4 bg-white">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={!isMember}
            />
            <button
              type="submit"
              disabled={!message.trim() || !isMember}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
