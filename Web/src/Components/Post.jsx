import React from "react";
import { Heart, MessageCircle, Users } from "lucide-react";

export default function Post({
  user,
  content,
  image,
  likes,
  comments,
  shares,
  timestamp,
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-2">
      {/* User Info */}
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={`https://ui-avatars.com/api/?name=${user}`}
          alt={user}
          className="h-8 w-8 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{user}</h3>
          <p className="text-sm text-gray-500">{timestamp}</p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-800 mb-4">{content}</p>

      {image && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img src={image} alt="Post content" className="w-full h-auto" />
        </div>
      )}

      {/* Post Footer: Likes, Comments, Shares */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600">
            <Heart className="h-5 w-5" />
            <span>{likes}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600">
            <MessageCircle className="h-5 w-5" />
            <span>{comments}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600">
            <Users className="h-5 w-5" />
            <span>{shares}</span>
          </button>
        </div>

        <button className="text-blue-600 hover:underline text-sm">Share</button>
      </div>
    </div>
  );
}
