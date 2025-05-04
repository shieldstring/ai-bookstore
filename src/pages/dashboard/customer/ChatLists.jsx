import React, { useEffect } from "react";
import SEO from "../../../components/SEO";
import { Search } from "lucide-react";
import GroupCard from "../../../components/dashboard/GroupCard";

function ChatLists() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  
  const groups = [
    {
      id: 1,
      name: "Book Lovers Club",
      members: 142,
      discussions: 24,
    },
    {
      id: 2,
      name: "Sci-Fi Readers",
      members: 89,
      discussions: 15,
    },
    {
      id: 3,
      name: "Business Book Club",
      members: 56,
      discussions: 8,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <SEO
        title="Chats"
        description="AI-Powered Social-Ecommerce Platform is a comprehensive system integrating eCommerce, social networking, and MLM for book sales, community engagement, and earning opportunities."
        name="AI-Powered Social-Ecommerce"
        type="description"
      />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Chats</h2>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search groups..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-44 md:w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}
export default ChatLists;
