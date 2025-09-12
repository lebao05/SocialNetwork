import React from "react";
import { Video, ImageIcon, Smile } from "lucide-react";

export default function CreatePost() {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      {/* Post placeholder */}
      <div className="flex items-center space-x-3 mb-4 cursor-pointer">
        <img
          src="https://i.pravatar.cc/150?img=10"
          alt="avatar"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex-1 bg-gray-100 rounded-full h-10 flex items-center px-4 text-gray-500 hover:bg-gray-200 transition-colors">
          What's on your mind?
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-around border-t border-gray-200 pt-2">
        <div className="flex items-center space-x-2 hover:bg-gray-100 rounded-md px-3 py-2 flex-1 justify-center cursor-pointer transition-colors">
          <Video className="text-red-500 w-5 h-5" />
          <span className="text-sm font-medium text-gray-700">
            Video Streaming
          </span>
        </div>
        <div className="flex items-center space-x-2 hover:bg-gray-100 rounded-md px-3 py-2 flex-1 justify-center cursor-pointer transition-colors">
          <ImageIcon className="text-green-500 w-5 h-5" />
          <span className="text-sm font-medium text-gray-700">Image/Video</span>
        </div>
        <div className="flex items-center space-x-2 hover:bg-gray-100 rounded-md px-3 py-2 flex-1 justify-center cursor-pointer transition-colors">
          <Smile className="text-yellow-500 w-5 h-5" />
          <span className="text-sm font-medium text-gray-700">
            Feeling/Activity
          </span>
        </div>
      </div>
    </div>
  );
}
