import React from "react";
import Navbar from "../Components/Home/NavBar";
import RightSidebar from "../Components/Home/RightSideBar";
import { LeftSideBar } from "../Components/Home/LeftSideBar";
import Feed from "../Components/Home/Feed";

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="flex justify-center">
        {/* Left Sidebar */}
        <div className="hidden lg:block lg:w-1/5 mt-5">
          <LeftSideBar />
        </div>

        {/* Feed */}
        <div className="w-full lg:w-3/5 mt-5 px-2">
          <Feed />
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block xl:w-1/5 mt-5">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
