import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  useGetUserGroupsQuery,
  useGetGroupDiscussionsQuery,
  useAddDiscussionMutation
} from "../../redux/slices/groupApiSlice";
// import { initSocket } from "../../sockets/socket";
import { Send, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MessageList = () => {
  const { data: userGroups = [], isLoading } = useGetUserGroupsQuery();
  const { userInfo } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGroupId, setActiveGroupId] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const socket = initSocket();
    
  //   socket.on("newDiscussion", () => {
  //     // Refresh user groups when a new discussion is added
  //     refetchUserGroups();
  //   });

  //   return () => {
  //     socket.off("newDiscussion");
  //   };
  // }, []);

  const handleCreateNewMessage = () => {
    navigate("/dashboard/groups");
  };

  const filteredGroups = userGroups.filter((group) => {
    return group.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-full flex flex-col border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Group Chats</h2>
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="Search groups"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading groups...</div>
        ) : filteredGroups.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? "No matching groups" : "No groups joined yet"}
          </div>
        ) : (
          <ul>
            {filteredGroups.map((group) => {
              const isActive = activeGroupId === group._id;
              const lastDiscussion = group.latestDiscussion || {};

              return (
                <li
                  key={group._id}
                  onClick={() => navigate(`/dashboard/groups/${group._id}`)}
                  className={`border-b border-gray-200 cursor-pointer ${
                    isActive ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center p-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-3">
                      {group.avatar ? (
                        <img
                          src={group.avatar}
                          alt={group.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Users className="h-full w-full p-2 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {group.name || "Unnamed Group"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {lastDiscussion.createdAt
                            ? new Date(lastDiscussion.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 truncate">
                          {lastDiscussion.content || "No discussions yet"}
                        </p>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">
                            {group.members || 0} members
                          </span>
                          {group.unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {group.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleCreateNewMessage}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Send className="h-5 w-5 mr-2" />
          Join New Group
        </button>
      </div>
    </div>
  );
};

export default MessageList;