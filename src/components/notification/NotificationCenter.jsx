import { useState, useEffect } from "react";
import { Bell, Check, Settings, X, Trash2, Calendar, AlertCircle, Mail, User, FileText } from "lucide-react";
import { notificationManager } from "../../utils/notificationUtils";
import { Link, useNavigate } from "react-router-dom";

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = notificationManager.addListener((notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Initial load
    const loadNotifications = async () => {
      setLoading(true);
      try {
        // Simulate API call
        const mockNotifications = await fetchNotifications();
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter((n) => !n.read).length);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();

    return unsubscribe;
  }, []);

  const markAsRead = (id, event) => {
    event.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const deleteNotification = (id, event) => {
    event.stopPropagation();
    const notification = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  const viewAllNotifications = () => {
    setIsOpen(false);
    navigate("/dashboard/notifications");
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "message":
        return <Mail className="w-4 h-4 text-blue-500" />;
      case "system":
        return <AlertCircle className="w-4 h-4 text-purple-500" />;
      case "calendar":
        return <Calendar className="w-4 h-4 text-green-500" />;
      case "user":
        return <User className="w-4 h-4 text-orange-500" />;
      case "document":
        return <FileText className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification) => {
    // If notification isn't read, mark it as read
    if (!notification.read) {
      markAsRead(notification.id, { stopPropagation: () => {} });
    }
    
    // Navigate to relevant page based on notification type
    if (notification.link) {
      navigate(notification.link);
      setIsOpen(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else if (diffInSeconds < 604800) { // 7 days
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 relative focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
            <h3 className="font-medium text-gray-800">Notifications</h3>
            <div className="flex space-x-2">
              <button 
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1"
                disabled={unreadCount === 0}
              >
                Mark all read
              </button>
              <button 
                className="text-gray-500 hover:text-gray-700"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin inline-block w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full mb-2"></div>
                <p>Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p>No notifications</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {notifications.slice(0, 5).map((notification) => (
                  <li
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex">
                      <div className="mr-3 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {notification.body}
                        </p>
                        {notification.category && (
                          <span className="inline-block text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full mt-1">
                            {notification.category}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col ml-2 space-y-1">
                        {!notification.read && (
                          <button
                            onClick={(e) => markAsRead(notification.id, e)}
                            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                            title="Mark as read"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={(e) => deleteNotification(notification.id, e)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-3 border-t border-gray-200 text-center bg-gray-50 rounded-b-lg">
            <button 
              onClick={viewAllNotifications}
              className="w-full py-2 px-4 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

async function fetchNotifications() {
  // Replace with actual API call
  return [
    {
      id: "1",
      title: "New Message",
      body: "You have a new message from John about the project proposal.",
      timestamp: new Date().toISOString(),
      read: false,
      type: "message",
      category: "Messages",
      link: "/dashboard/messages/1"
    },
    {
      id: "2",
      title: "System Update",
      body: "New features available in v2.0. Check out the improved dashboard and notification system.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
      type: "system",
      category: "Updates",
      link: "/dashboard/updates"
    },
    {
      id: "3",
      title: "Meeting Reminder",
      body: "Team standup meeting in 30 minutes. Don't forget to prepare your weekly report.",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false,
      type: "calendar",
      category: "Calendar",
      link: "/dashboard/calendar"
    },
    {
      id: "4",
      title: "New Document Shared",
      body: "Sarah shared 'Q2 Marketing Plan' with you. Review required by Friday.",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: false,
      type: "document",
      category: "Documents",
      link: "/dashboard/documents/42"
    },
    {
      id: "5",
      title: "Profile Update Required",
      body: "Please update your profile information to comply with new security policies.",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      read: true,
      type: "user",
      category: "Account",
      link: "/dashboard/profile"
    }
  ];
}

export default NotificationCenter;