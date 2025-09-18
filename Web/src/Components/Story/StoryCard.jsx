import React from "react";
import { Plus } from "lucide-react";

export default function StoryCard({ story, isCreate }) {
  if (isCreate) {
    return (
      <div className="flex-shrink-0 w-24 h-52 bg-gray-100 rounded-xl relative cursor-pointer hover:scale-105 transform transition flex flex-col items-center justify-center">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600">
          <Plus className="w-6 h-6" />
        </div>
        <p className="text-xs font-semibold text-gray-900 mt-2 text-center">
          Create Story
        </p>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-24 sm:w-28 md:w-32 h-52 rounded-xl relative cursor-pointer hover:scale-105 transform transition">
      {/* Name on top */}
      <p className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-white z-10">
        {story.name}
      </p>

      <img
        src={story.image}
        alt={story.name}
        className="w-full h-full object-cover rounded-xl"
      />
    </div>
  );
}
