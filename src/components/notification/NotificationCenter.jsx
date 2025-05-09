import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  Settings,
  X,
  Trash2,
  Users,
  MessageSquare,
  Heart,
  AtSign,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetNotificationsQuery,
  useMarkNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useMarkAllNotificationsAsReadMutation,
  useGetUnreadCountQuery,
} from "../../redux/slices/notificationSlice";

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state and API hooks
  const { data: notifications = [], isLoading } = useGetNotificationsQuery();
  const { data: unreadCount = 0 } = useGetUnreadCountQuery();
  const [markAsRead] = useMarkNotificationsAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const handleMarkAsRead = async (id, event) => {
    event?.stopPropagation();
    try {
      await markAsRead([id]);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDelete = async (id, event) => {
    event?.stopPropagation();
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const viewAllNotifications = () => {
    setIsOpen(false);
    navigate("/dashboard/notifications");
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "groupInvite":
        return <Users className="w-4 h-4 text-blue-500" />;
      case "newDiscussion":
      case "discussionComment":
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case "commentMention":
        return <AtSign className="w-4 h-4 text-purple-500" />;
      case "discussionLike":
        return <Heart className="w-4 h-4 text-red-500" />;
      case "groupActivity":
        return <Users className="w-4 h-4 text-orange-500" />;
      case "system":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification) => {
    // If notification isn't read, mark it as read
    if (!notification.read) {
      handleMarkAsRead(notification._id, { stopPropagation: () => {} });
    }

    // Navigate to relevant page based on notification type
    if (notification.type === "groupInvite" && notification.group?._id) {
      navigate(`/groups/${notification.group._id}`);
    } else if (
      notification.type === "discussionComment" &&
      notification.discussion?._id
    ) {
      navigate(`/discussions/${notification.discussion._id}`);
    }
    // Add more navigation cases as needed

    setIsOpen(false);
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
    } else if (diffInSeconds < 604800) {
      // 7 days
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationTitle = (notification) => {
    switch (notification.type) {
      case "groupInvite":
        return `${notification.sender?.name || "Someone"} invited you to join ${
          notification.group?.name || "a group"
        }`;
      case "newDiscussion":
        return `New discussion in ${notification.group?.name || "a group"}`;
      case "commentMention":
        return `${notification.sender?.name || "Someone"} mentioned you`;
      case "discussionLike":
        return `${notification.sender?.name || "Someone"} liked your post`;
      case "discussionComment":
        return `${
          notification.sender?.name || "Someone"
        } commented on your post`;
      case "groupActivity":
        return `New activity in ${notification.group?.name || "a group"}`;
      case "system":
        return "System notification";
      default:
        return notification.message;
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
        <div className="absolute right-0 lg:right-auto lg:left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
            <h3 className="font-medium text-gray-800">Notifications</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleMarkAllAsRead}
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
            {isLoading ? (
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
                    key={notification._id}
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
                            {getNotificationTitle(notification)}
                          </p>
                          <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                            {formatTimestamp(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        {notification.type && (
                          <span className="inline-block text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full mt-1">
                            {notification.type}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col ml-2 space-y-1">
                        {!notification.read && (
                          <button
                            onClick={(e) =>
                              handleMarkAsRead(notification._id, e)
                            }
                            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                            title="Mark as read"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(notification._id, e)}
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

export default NotificationCenter;
