import React from "react";
import { Heart, MessageCircle, UserPlus, Calendar, Gift } from "lucide-react";
import Navbar from "../Components/Home/NavBar";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "like",
      user: "Sarah Johnson",
      avatar: "/woman-profile.png",
      action: "liked your post",
      time: "5 minutes ago",
      unread: true,
      icon: Heart,
      iconColor: "text-red-500",
    },
    {
      id: 2,
      type: "comment",
      user: "Mike Chen",
      avatar: "/thoughtful-asian-man.png",
      action: "commented on your photo",
      time: "1 hour ago",
      unread: true,
      icon: MessageCircle,
      iconColor: "text-blue-500",
    },
    {
      id: 3,
      type: "friend_request",
      user: "Emma Wilson",
      avatar: "/blonde-woman-portrait.png",
      action: "sent you a friend request",
      time: "2 hours ago",
      unread: true,
      icon: UserPlus,
      iconColor: "text-green-500",
    },
    {
      id: 4,
      type: "event",
      user: "David Rodriguez",
      avatar: "/thoughtful-hispanic-man.png",
      action: "invited you to an event",
      time: "3 hours ago",
      unread: false,
      icon: Calendar,
      iconColor: "text-purple-500",
    },
    {
      id: 5,
      type: "birthday",
      user: "Lisa Park",
      avatar: "/korean-woman.png",
      action: "has a birthday today",
      time: "1 day ago",
      unread: false,
      icon: Gift,
      iconColor: "text-yellow-500",
    },
    {
      id: 6,
      type: "like",
      user: "John Smith",
      avatar: "/caucasian-man.png",
      action: "and 5 others liked your comment",
      time: "2 days ago",
      unread: false,
      icon: Heart,
      iconColor: "text-red-500",
    },
    {
      id: 4,
      type: "event",
      user: "David Rodriguez",
      avatar: "/thoughtful-hispanic-man.png",
      action: "invited you to an event",
      time: "3 hours ago",
      unread: false,
      icon: Calendar,
      iconColor: "text-purple-500",
    },
    {
      id: 5,
      type: "birthday",
      user: "Lisa Park",
      avatar: "/korean-woman.png",
      action: "has a birthday today",
      time: "1 day ago",
      unread: false,
      icon: Gift,
      iconColor: "text-yellow-500",
    },
    {
      id: 6,
      type: "like",
      user: "John Smith",
      avatar: "/caucasian-man.png",
      action: "and 5 others liked your comment",
      time: "2 days ago",
      unread: false,
      icon: Heart,
      iconColor: "text-red-500",
    },
    {
      id: 4,
      type: "event",
      user: "David Rodriguez",
      avatar: "/thoughtful-hispanic-man.png",
      action: "invited you to an event",
      time: "3 hours ago",
      unread: false,
      icon: Calendar,
      iconColor: "text-purple-500",
    },
    {
      id: 5,
      type: "birthday",
      user: "Lisa Park",
      avatar: "/korean-woman.png",
      action: "has a birthday today",
      time: "1 day ago",
      unread: false,
      icon: Gift,
      iconColor: "text-yellow-500",
    },
    {
      id: 6,
      type: "like",
      user: "John Smith",
      avatar: "/caucasian-man.png",
      action: "and 5 others liked your comment",
      time: "2 days ago",
      unread: false,
      icon: Heart,
      iconColor: "text-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <div className="flex items-center space-x-4 mt-4">
              <button className="px-3 py-1 bg-gray-200 rounded-full text-sm font-medium hover:bg-gray-300">
                All
              </button>
              <button className="px-3 py-1 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
                Unread
              </button>
              <button className="px-3 py-1 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
                Mentions
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow divide-y divide-gray-100">
          {notifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <div
                key={notification.id}
                className={`p-4 flex items-start space-x-3 cursor-pointer hover:bg-gray-50 ${
                  notification.unread ? "bg-blue-50" : ""
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={notification.avatar || "/placeholder.svg"}
                    alt={notification.user}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                    <IconComponent
                      className={`h-4 w-4 ${notification.iconColor}`}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{notification.user}</span>{" "}
                    {notification.action}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {notification.time}
                  </p>

                  {/* Friend Request Buttons */}
                  {notification.type === "friend_request" && (
                    <div className="flex items-center space-x-2 mt-3">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700">
                        Accept
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100">
                        Decline
                      </button>
                    </div>
                  )}
                </div>

                {/* Unread dot */}
                {notification.unread && (
                  <div className="h-2 w-2 bg-blue-600 rounded-full mt-1"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 text-center">
          <button className="text-blue-600 hover:underline text-sm font-medium">
            See all notifications
          </button>
        </div>
      </div>
    </div>
  );
}
