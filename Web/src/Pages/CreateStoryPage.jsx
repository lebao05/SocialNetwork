import { Settings } from "lucide-react";
import { useState } from "react";
import PrivacySetting from "../Components/Security/PrivacySetting.jsx";
import Navbar from "../Components/Home/NavBar";
export default function CreateStoryPage() {
  const [showPrivacySetting, setShowPrivacySetting] = useState(false);
  const [privacySetting, setPrivacySetting] = useState("friends");

  const handleCreateStory = (type) => {
    // Show privacy setting before creating story
    setShowPrivacySetting(true);
  };

  const handlePrivacySave = (setting) => {
    setPrivacySetting(setting);
    // Here you would proceed with creating the story
    console.log("Creating story with privacy:", setting);
  };

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen w-full bg-gray-100">
        {/* Left Sidebar */}
        <div className="w-80 hidden md:block bg-white shadow-lg p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-900">Tin của bạn</h1>
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              onClick={() => setShowPrivacySetting(true)}
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center p-3  rounded-lg cursor-pointer ">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Lê Bảo</div>
                <div className="text-sm text-gray-500">Thêm vào tin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-row  justify-center items-center gap-4 md:gap-6 p-4">
          {/* Image Story */}
          <div
            onClick={() => handleCreateStory("image")}
            className="relative w-full md:w-64 h-96 rounded-xl bg-gradient-to-br from-purple-600 to-blue-400 shadow-lg cursor-pointer flex flex-col items-center justify-center transition-transform hover:scale-105"
          >
            <div className="bg-white rounded-full p-4 mb-4 shadow">
              <svg
                className="w-8 h-8 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21,15 16,10 5,21" />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg text-center">
              Tạo tin dạng ảnh
            </span>
          </div>

          {/* Text Story */}
          <div
            onClick={() => handleCreateStory("text")}
            className="relative w-full md:w-64 h-96 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 shadow-lg cursor-pointer flex flex-col items-center justify-center transition-transform hover:scale-105"
          >
            <div className="bg-white rounded-full p-4 mb-4 shadow">
              <span className="font-bold text-lg text-gray-800">Aa</span>
            </div>
            <span className="text-white font-semibold text-lg text-center">
              Tạo tin dạng văn bản
            </span>
          </div>
        </div>

        {/* Privacy Setting Modal */}
        <PrivacySetting
          isOpen={showPrivacySetting}
          onClose={() => setShowPrivacySetting(false)}
          onSave={handlePrivacySave}
          initialSelected={privacySetting}
        />
      </div>
    </div>
  );
}
