import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  Trash2,
  ChevronDown,
  Search,
  CheckCircle,
  ArrowLeft,
  Users,
  MessageSquare,
  Heart,
  AtSign,
  AlertCircle,
  Settings,
} from "lucide-react";
import {
  useGetNotificationsQuery,
  useMarkNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteAllNotificationsMutation,
} from "../../redux/slices/notificationSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedNotifications,
  toggleBulkSelect,
  setActiveFilter,
  setTimeRange,
  setSearchTerm,
  resetNotificationFilters,
} from "../../redux/slices/notificationSlice";
import SEO from "../../components/SEO";

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const {
    selectedNotifications,
    bulkSelectActive,
    activeFilter,
    timeRange,
    searchTerm,
  } = useSelector((state) => state.notification);

  const { data: notifications = [], isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkNotificationsAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();

  // Extract unique notification types
  const categories = [...new Set(notifications.map((n) => n.type))];

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead([id]);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      dispatch(
        setSelectedNotifications(
          selectedNotifications.filter((itemId) => itemId !== id)
        )
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleSelectNotification = (id) => {
    if (bulkSelectActive) {
      const newSelected = selectedNotifications.includes(id)
        ? selectedNotifications.filter((itemId) => itemId !== id)
        : [...selectedNotifications, id];
      dispatch(setSelectedNotifications(newSelected));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      if (selectedNotifications.length > 0) {
        await markAsRead(selectedNotifications);
      } else {
        await markAllAsRead();
      }
      dispatch(setSelectedNotifications([]));
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      if (selectedNotifications.length > 0) {
        await deleteAllNotifications(selectedNotifications);
      }
      dispatch(setSelectedNotifications([]));
    } catch (error) {
      console.error("Error deleting notifications:", error);
    }
  };

  //   const toggleBulkSelect = () => {
  //     setBulkSelectActive(!bulkSelectActive);
  //     if (bulkSelectActive) {
  //       setSelectedNotifications([]);
  //     }
  //   };

  const selectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n._id));
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "groupInvite":
        return <Users size={16} className="text-blue-500" />;
      case "newDiscussion":
      case "discussionComment":
        return <MessageSquare size={16} className="text-green-500" />;
      case "commentMention":
        return <AtSign size={16} className="text-purple-500" />;
      case "discussionLike":
        return <Heart size={16} className="text-red-500" />;
      case "groupActivity":
        return <Users size={16} className="text-orange-500" />;
      case "system":
        return <AlertCircle size={16} className="text-yellow-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return (
        date.toLocaleDateString([], { month: "short", day: "numeric" }) +
        ` at ${date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      );
    }
  };

  // Filter notifications based on current filters and search
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by read/unread status
    if (activeFilter === "unread" && notification.read) return false;
    if (activeFilter === "read" && !notification.read) return false;

    // Filter by type
    if (
      activeFilter !== "all" &&
      activeFilter !== "read" &&
      activeFilter !== "unread" &&
      notification.type !== activeFilter
    )
      return false;

    // Filter by time range
    const notificationTime = new Date(notification.createdAt);
    const now = new Date();
    if (timeRange === "today") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (notificationTime < today) return false;
    } else if (timeRange === "week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (notificationTime < weekAgo) return false;
    } else if (timeRange === "month") {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      if (notificationTime < monthAgo) return false;
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        notification.message.toLowerCase().includes(searchLower) ||
        (notification.sender?.name &&
          notification.sender.name.toLowerCase().includes(searchLower)) ||
        (notification.group?.name &&
          notification.group.name.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce(
    (groups, notification) => {
      const date = new Date(notification.createdAt);
      const dateString = date.toDateString();

      if (!groups[dateString]) {
        groups[dateString] = [];
      }

      groups[dateString].push(notification);
      return groups;
    },
    {}
  );

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedNotifications).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  // Get human-readable date header
  const getDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEO
        title="Notifications"
        description="AI-Powered Social-Ecommerce Platform is a comprehensive system integrating eCommerce, social networking, and MLM for book sales, community engagement, and earning opportunities."
        name="AI-Powered Social-Ecommerce"
        type="description"
      />
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button className="mr-4 text-gray-400 hover:text-gray-600">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900 flex items-center">
                <Bell className="mr-2 text-blue-600 w-5 h-5" />
                Notifications
              </h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={toggleBulkSelect}
                className={`px-3 py-1 text-sm rounded-md ${
                  bulkSelectActive
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {bulkSelectActive ? "Cancel" : "Select"}
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Filters and Search */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notifications..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div className="flex space-x-2">
            <div className="relative inline-block text-left flex-1">
              <div className="group">
                <button className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <span>
                    {activeFilter === "all"
                      ? "All notifications"
                      : activeFilter === "read"
                      ? "Read notifications"
                      : activeFilter === "unread"
                      ? "Unread notifications"
                      : `${activeFilter} notifications`}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                </button>
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 hidden group-hover:block">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        activeFilter === "all"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700"
                      } hover:bg-gray-100`}
                      onClick={() => setActiveFilter("all")}
                    >
                      All notifications
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        activeFilter === "unread"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700"
                      } hover:bg-gray-100`}
                      onClick={() => setActiveFilter("unread")}
                    >
                      Unread notifications
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        activeFilter === "read"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700"
                      } hover:bg-gray-100`}
                      onClick={() => setActiveFilter("read")}
                    >
                      Read notifications
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    {categories.map((type) => (
                      <button
                        key={type}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          activeFilter === type
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700"
                        } hover:bg-gray-100`}
                        onClick={() => setActiveFilter(type)}
                      >
                        {type} notifications
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative inline-block text-left flex-1">
              <div className="group">
                <button className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <span>
                    {timeRange === "all"
                      ? "All time"
                      : timeRange === "today"
                      ? "Today"
                      : timeRange === "week"
                      ? "Last 7 days"
                      : "Last 30 days"}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                </button>
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 hidden group-hover:block">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        timeRange === "all"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700"
                      } hover:bg-gray-100`}
                      onClick={() => setTimeRange("all")}
                    >
                      All time
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        timeRange === "today"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700"
                      } hover:bg-gray-100`}
                      onClick={() => setTimeRange("today")}
                    >
                      Today
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        timeRange === "week"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700"
                      } hover:bg-gray-100`}
                      onClick={() => setTimeRange("week")}
                    >
                      Last 7 days
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        timeRange === "month"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700"
                      } hover:bg-gray-100`}
                      onClick={() => setTimeRange("month")}
                    >
                      Last 30 days
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            {bulkSelectActive && (
              <>
                <button
                  onClick={selectAll}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md"
                >
                  {selectedNotifications.length === filteredNotifications.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={selectedNotifications.length === 0}
                  className={`px-3 py-1 text-sm rounded-md ${
                    selectedNotifications.length === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  Mark Read
                </button>
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedNotifications.length === 0}
                  className={`px-3 py-1 text-sm rounded-md ${
                    selectedNotifications.length === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-sm font-medium text-gray-500">Total</div>
            <div className="mt-1 text-2xl font-semibold">
              {notifications.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-sm font-medium text-gray-500">Unread</div>
            <div className="mt-1 text-2xl font-semibold text-blue-600">
              {notifications.filter((n) => !n.read).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-sm font-medium text-gray-500">This Week</div>
            <div className="mt-1 text-2xl font-semibold">
              {
                notifications.filter((n) => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(n.createdAt) >= weekAgo;
                }).length
              }
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-sm font-medium text-gray-500">Types</div>
            <div className="mt-1 text-2xl font-semibold">
              {categories.length}
            </div>
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                <Bell className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No notifications
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "No notifications match your search."
                  : activeFilter !== "all"
                  ? `No ${activeFilter.toLowerCase()} notifications found.`
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            sortedDates.map((dateString) => (
              <div key={dateString} className="space-y-2">
                <h2 className="text-sm font-medium text-gray-500 px-2">
                  {getDateHeader(dateString)}
                </h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {groupedNotifications[dateString].map(
                    (notification, index) => (
                      <div
                        key={notification._id}
                        onClick={() =>
                          handleSelectNotification(notification._id)
                        }
                        className={`
                        flex px-4 py-3 border-b last:border-b-0 border-gray-100
                        ${
                          bulkSelectActive
                            ? "cursor-pointer hover:bg-gray-50"
                            : ""
                        }
                        ${
                          selectedNotifications.includes(notification._id)
                            ? "bg-blue-50"
                            : ""
                        }
                        ${!notification.read ? "bg-blue-50" : ""}
                      `}
                      >
                        {bulkSelectActive && (
                          <div className="mr-3 flex items-center">
                            <div
                              className={`
                            w-5 h-5 rounded border flex items-center justify-center
                            ${
                              selectedNotifications.includes(notification._id)
                                ? "bg-blue-500 border-blue-500"
                                : "border-gray-300"
                            }
                          `}
                            >
                              {selectedNotifications.includes(
                                notification._id
                              ) && <Check size={12} className="text-white" />}
                            </div>
                          </div>
                        )}

                        <div className="mr-3 flex-shrink-0 mt-1">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>

                        <div className="flex-grow min-w-0">
                          <div className="flex items-start justify-between">
                            <p
                              className={`text-sm font-medium ${
                                !notification.read
                                  ? "text-gray-900"
                                  : "text-gray-600"
                              }`}
                            >
                              {getNotificationTitle(notification)}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="text-xs text-gray-400">
                                {formatDate(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 truncate">
                            {notification.message}
                          </p>
                          <div className="mt-2 flex items-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {notification.type}
                            </span>
                            <div className="ml-auto flex space-x-2">
                              {!notification.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification._id);
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                  <CheckCircle size={14} className="mr-1" />
                                  Mark as read
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(notification._id);
                                }}
                                className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                              >
                                <Trash2 size={14} className="mr-1" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty state footer */}
        {!isLoading &&
          notifications.length > 0 &&
          filteredNotifications.length === 0 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  setActiveFilter("all");
                  setTimeRange("all");
                  setSearchTerm("");
                }}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100"
              >
                Clear all filters
              </button>
            </div>
          )}

        {/* Pagination */}
        {filteredNotifications.length > 10 && (
          <div className="mt-8 flex justify-center">
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Previous</span>
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                1
              </button>
              <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                2
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Next</span>
                <ArrowLeft
                  className="h-5 w-5 transform rotate-180"
                  aria-hidden="true"
                />
              </button>
            </nav>
          </div>
        )}
      </main>
    </div>
  );
}
