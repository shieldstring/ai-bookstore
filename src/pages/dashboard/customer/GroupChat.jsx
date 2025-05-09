import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetGroupDetailsQuery,
  useGetGroupDiscussionsQuery,
  useAddDiscussionMutation,
} from "../../../redux/slices/groupApiSlice";
import { Send, ArrowLeft, Users } from "lucide-react";
import { Link } from "react-router-dom";

const GroupChat = () => {
  const { groupId } = useParams();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { userInfo } = useSelector((state) => state.auth);

  const { data: group = {}, isLoading: isLoadingGroup } =
    useGetGroupDetailsQuery(groupId);

  const {
    data: discussions = [],
    isLoading: isLoadingDiscussions,
    refetch: refetchDiscussions,
  } = useGetGroupDiscussionsQuery(groupId);

  const [addDiscussion] = useAddDiscussionMutation();



  useEffect(() => {
    scrollToBottom();
  }, [discussions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await addDiscussion({ groupId, content: message });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (isLoadingGroup) {
    return <div className="p-4 text-center">Loading group details...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center">
        <Link to="/dashboard/chats" className="mr-3">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
          {group.avatar ? (
            <img
              src={group.avatar}
              alt={group.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Users className="h-full w-full p-1.5 text-gray-400" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{group.name}</h2>
          <p className="text-sm text-gray-500">
            {group.members?.length || 0} members
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingDiscussions ? (
          <div className="text-center text-gray-500">
            Loading discussions...
          </div>
        ) : discussions.length === 0 ? (
          <div className="text-center text-gray-500">No discussions yet</div>
        ) : (
          discussions.map((discussion) => {
            const isCurrentUser = discussion.user?._id === userInfo._id;
            return (
              <div
                key={discussion._id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex max-w-[70%]">
                  {!isCurrentUser && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 overflow-hidden mr-2 mt-1">
                      {discussion.user?.avatar ? (
                        <img
                          src={discussion.user.avatar}
                          alt={discussion.user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white">
                          {discussion.user?.name?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    {!isCurrentUser && (
                      <p className="text-xs text-gray-500 mb-1">
                        {discussion.user?.name || "Unknown User"}
                      </p>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 break-words ${
                        isCurrentUser
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p>{discussion.content}</p>
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

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;
