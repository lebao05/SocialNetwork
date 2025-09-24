import {
  Home,
  Users,
  MessageCircle,
  Bell,
  ShoppingBag,
  Calendar,
  Bookmark,
  Clock,
  Images,
  UsersRound,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import anonymous from "../../assets/anonymous.png";
export function LeftSideBar() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const menuItems = [
    { icon: Home, label: "Home", active: true, href: "/" },
    { icon: Users, label: "Friends", href: "/friends" },
    { icon: MessageCircle, label: "Messages", href: "/messages" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: UsersRound, label: "Groups", href: "/groups" },
    { icon: Images, label: "Media Groups", href: "/media-groups" },
    { icon: ShoppingBag, label: "Marketplace", href: "/marketplace" },
    { icon: Calendar, label: "Events", href: "/events" },
    { icon: Bookmark, label: "Saved", href: "/saved" },
    { icon: Clock, label: "Memories", href: "/memories" },
  ];

  return (
    // 🔥 Only visible on large screens (lg+)
    <div className="background px-4 space-y-2 h-[calc(100vh-3.5rem)] overflow-y-auto ">
      {/* User Profile */}
      <a
        className="flex cursor-pointer items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors mb-4"
        onClick={() => navigate(`/profile/${user.id}`)}
      >
        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          <img
            src={user.avatar || anonymous}
            alt="User Avatar"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement.textContent = "JD";
            }}
          />
        </div>
        <span className="font-semibold text-gray-800">
          {user.firstName} {user.lastName}
        </span>
      </a>

      {/* Navigation Menu */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href || "#"}
            className={`flex items-center gap-3 h-12 px-3 rounded-lg transition-colors ${
              item.active
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
