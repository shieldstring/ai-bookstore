import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, BookOpenIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const UserCard = ({ user, isProfile = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden">
          <img 
            src={user.avatar || '/images/avatar-placeholder.png'} 
            alt={user.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-gray-600 text-sm">@{user.username}</p>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{user.bio || 'No bio yet'}</p>
      
      <div className="flex justify-between text-sm text-gray-600 mb-6">
        <div className="flex items-center space-x-1">
          <BookOpenIcon className="h-4 w-4" />
          <span>{user.stats?.booksRead || 0} books</span>
        </div>
        <div className="flex items-center space-x-1">
          <UserGroupIcon className="h-4 w-4" />
          <span>{user.stats?.groupsJoined || 0} groups</span>
        </div>
        <div className="flex items-center space-x-1">
          <StarIcon className="h-4 w-4" />
          <span>{user.stats?.rating?.toFixed(1) || '0.0'}</span>
        </div>
      </div>
      
      {!isProfile && (
        <Link
          to={`/profile/${user._id}`}
          className="block text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          View Profile
        </Link>
      )}
    </div>
  );
};

export default UserCard;