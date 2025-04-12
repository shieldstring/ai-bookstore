import React, { useState, useEffect, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead } from '../../features/social/socialSlice';
import { initSocket } from '../../sockets/socket';

const NotificationDropdown = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state) => state.social);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchNotifications());
    
    const socket = initSocket();
    socket.on('notification', () => {
      dispatch(fetchNotifications());
    });
    
    return () => {
      socket.off('notification');
    };
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (notificationId) => {
    dispatch(markAsRead(notificationId));
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-10 border border-gray-200">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
            </div>
            
            {notifications.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">No notifications</div>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification._id)}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                        <img 
                          src={notification.sender?.avatar || '/images/avatar-placeholder.png'} 
                          alt={notification.sender?.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.sender?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="ml-2 h-2 w-2 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="px-4 py-2 border-t border-gray-200">
              <button
                onClick={() => {
                  notifications.forEach(n => {
                    if (!n.read) dispatch(markAsRead(n._id));
                  });
                }}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;