import { Users, Plus, Search, MessageCircle } from "lucide-react";
import GroupCard from "../../../components/dashboard/GroupCard";
import SEO from "../../../components/SEO";
import { useEffect, useState } from "react";
import GroupForm from "../../../components/dashboard/GroupForm";

const Groups = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const [modal, setModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const allGroups = [
    {
      id: 1,
      name: "Book Lovers Club",
      members: 142,
      discussions: 24,
      joined: true,
    },
    {
      id: 2,
      name: "Sci-Fi Readers",
      members: 89,
      discussions: 15,
      joined: false,
    },
    {
      id: 3,
      name: "Business Book Club",
      members: 56,
      discussions: 8,
      joined: true,
    },
    {
      id: 4,
      name: "Fantasy Bookworms",
      members: 78,
      discussions: 12,
      joined: false,
    },
    {
      id: 5,
      name: "Non-Fiction Network",
      members: 65,
      discussions: 9,
      joined: true,
    },
    {
      id: 6,
      name: "Mystery & Thriller Fans",
      members: 92,
      discussions: 18,
      joined: false,
    },
  ];

  // Filter groups based on search term
  const filteredGroups = allGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <SEO
          title="Groups"
          description="AI-Powered Social-Ecommerce Platform is a comprehensive system integrating eCommerce, social networking, and MLM for book sales, community engagement, and earning opportunities."
          name="AI-Powered Social-Ecommerce"
          type="description"
        />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Reading Groups</h2>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search groups..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-44 md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setModal(true)}
              className="text-xs lg:text-base flex items-center bg-purple-600 text-white py-2 px-3 lg:px-4 rounded-md hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1 lg:mr-2" />
              Create Group
            </button>
          </div>
        </div>

        {filteredGroups.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No groups found matching your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {group.name}
                  </h3>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{group.members} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{group.discussions} discussions</span>
                  </div>
                </div>
                <button
                  className={`w-full py-2 px-4 rounded-md ${
                    group.joined
                      ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  } transition-colors`}
                >
                  {group.joined ? "Leave Group" : "Join Group"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-[150] overflow-y-auto bg-[#000000]/50 ">
          <div className="flex items-end justify-center sm:min-h-screen px-4 pt-12 pb-20 text-center sm:block sm:p-0">
            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-center align-bottom transition-all transform bg-white rounded-2xl shadow-xl  top-20 md:top-0 sm:my-8 w-full sm:max-w-md sm:p-6 md:p-8 sm:align-middle">
              <GroupForm setModal={setModal} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Groups;