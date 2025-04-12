import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const skeletonItems = Array(count).fill(0);
  
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {skeletonItems.map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-1/2"></div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 w-4 bg-gray-200 rounded-full animate-pulse mr-1"></div>
                ))}
              </div>
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {skeletonItems.map((_, index) => (
          <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-full mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="space-y-2">
        {skeletonItems.map((_, index) => (
          <div key={index} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${Math.random() * 50 + 50}%` }}></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  );
};

export default LoadingSkeleton;