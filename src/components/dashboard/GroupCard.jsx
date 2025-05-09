
import React from "react";
import { Link } from "react-router-dom";
import { Users, MessageSquare } from "lucide-react";

const GroupCard = ({ group }) => {
  return (
    <Link 
      to={`/dashboard/groups/${group.id}`} 
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
          <div className="w-full h-full flex items-center justify-center bg-blue-50">
            <Users className="h-12 w-12 text-blue-300" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
            {group.avatar ? (
              <img
                src={group.avatar}
                alt={group.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white">
                {group.name.charAt(0)}
              </div>
            )}
          </div>
          <h3 className="font-semibold text-gray-800 truncate">{group.name}</h3>
        </div>
        
        {group.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{group.description}</p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{group.members} member{group.members !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{group.discussions} discussion{group.discussions !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GroupCard;