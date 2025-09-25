import React from "react";
import {
  Home,
  Video,
  Users,
  MessageSquare,
  Bell,
  Tv,
  Group,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../assets/logo.png";
import anonymous from "../../assets/anonymous.png";
export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const nagivate = useNavigate();
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white shadow sticky top-0 z-10">
      {/* Left: Logo + Search */}
      <div className="flex items-center space-x-2">
        <div
          className="w-9 h-9 rouded-full cursor-pointer"
          onClick={() => nagivate("/")}
        >
          <img
            src={logo}
            alt="Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <input
          type="text"
          placeholder="Search Facebook"
          className="hidden md:block px-3 py-1 rounded-full bg-gray-100 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Center: Navigation */}
      <div className="flex space-x-6 lg:pr-50">
        <button
          className="hover:bg-gray-100 cursor-pointer p-2 rounded-md"
          onClick={() => nagivate("/")}
        >
          <Home className="w-6 h-6 text-gray-700" />
        </button>
        <button className="hover:bg-gray-100 p-2 rounded-md">
          <Tv className="w-6 h-6 text-gray-700" />
        </button>
        <button className="hover:bg-gray-100 p-2 rounded-md" alt="Group">
          <Users className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Right: Messages, Notifications, Avatar */}
      <div className="flex items-center space-x-3">
        <button className="hover:bg-gray-100 p-2 rounded-full ">
          <MessageSquare className="w-5 h-5 text-gray-700" />
        </button>
        <button className="hover:bg-gray-100 p-2 rounded-full">
          <Bell className="w-5 h-5 text-gray-700" />
        </button>
        <img
          src={user?.avatarUrl || anonymous}
          alt="avatar"
          className="w-8 h-8 rounded-full cursor-pointer"
          onClick={() => nagivate("/profile/" + user.id)}
        />
      </div>
    </nav>
  );
}
