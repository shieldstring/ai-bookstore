import React from "react";
import { Link } from "react-router-dom";
import { Users, MessageSquare } from "lucide-react";

const GroupCard = ({ group }) => {
  // Calculate member count from members array length
  const memberCount = group.members?.length || 0;
  // Calculate discussion count from discussions array length
  const discussionCount = group.discussions?.length || 0;

  return (
    <Link
      to={`/dashboard/groups/${group._id}`}
      className="block border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <div className="h-36 bg-gray-100 relative">
        {group.coverImage ? (
          <img
            src={group.coverImage}
            alt={group.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex gap-4 items-center justify-center bg-blue-50">
            <Users className="h-12 w-12 text-blue-300" />
            <h3 className="font-semibold text-gray-800 capitalize truncate">
              {group.name}
            </h3>
          </div>
        )}
      </div>

      <div className="p-4">
        {group.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {group.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>
              {memberCount} member{memberCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>
              {discussionCount} discussion{discussionCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GroupCard;
