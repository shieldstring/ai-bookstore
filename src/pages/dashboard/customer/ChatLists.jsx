import React, { useState, useEffect } from "react";
import SEO from "../../../components/SEO";
import { Search, Plus } from "lucide-react";
import GroupCard from "../../../components/dashboard/GroupCard";
import { Link } from "react-router-dom";
import { useGetUserGroupsQuery } from "../../../redux/slices/groupApiSlice";
import LoadingSkeleton from "../../../components/preloader/LoadingSkeleton";
import ErrorMessage from "../../../components/common/ErrorMessage";

function ChatLists() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: userGroups = [] , isLoading, isError } = useGetUserGroupsQuery();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const filteredGroups = userGroups.filter((group) => {
    return group.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <SEO
        title="Group Chats"
        description="AI-Powered Social-Ecommerce Platform is a comprehensive system integrating eCommerce, social networking, and MLM for book sales, community engagement, and earning opportunities."
        name="AI-Powered Social-Ecommerce"
        type="description"
      />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Group Chats</h2>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-44 md:w-64"
            />
          </div>
          <Link
            to="/dashboard/groups"
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Join Group</span>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <LoadingSkeleton type={"card2"} count={4} />
        </div>
      ) : isError ? (
        <ErrorMessage error={"Error loading groups. Please try again."} />
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchQuery
            ? "No groups match your search"
            : "You haven't joined any groups yet. Join a group to start chatting!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <GroupCard key={group._id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatLists;
