import React from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, BookmarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const GroupCard = ({ group, isMember = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-40 bg-gray-100 relative">
        {group.image && (
          <img 
            src={group.image} 
            alt={group.name}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-white font-semibold text-lg">{group.name}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>
        
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <UsersIcon className="h-4 w-4" />
            <span>{group.memberCount} members</span>
          </div>
          <div className="flex items-center space-x-1">
            <ChatBubbleLeftRightIcon className="h-4 w-4" />
            <span>{group.discussionCount} discussions</span>
          </div>
        </div>
        
        <div className="flex justify-between">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {group.category}
          </span>
          
          {isMember ? (
            <Link
              to={`/groups/${group._id}`}
              className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
            >
              Enter Group
            </Link>
          ) : (
            <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
              Join Group
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;