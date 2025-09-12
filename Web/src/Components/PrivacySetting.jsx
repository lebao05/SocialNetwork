import React, { useState } from "react";
import { X, Globe, Users, User, Eye } from "lucide-react";
export default function PrivacySetting({
  isOpen = false,
  onClose = () => {},
  onSave = () => {},
  initialSelected = "friends",
}) {
  const [selectedOption, setSelectedOption] = useState(initialSelected);

  const privacyOptions = [
    {
      id: "public",
      icon: <Globe className="w-5 h-5" />,
      title: "Công khai",
      description: "Bất kỳ ai trên Facebook hoặc Messenger",
      value: "public",
    },
    {
      id: "friends",
      icon: <Users className="w-5 h-5" />,
      title: "Bạn bè",
      description: "Chỉ bạn bè của bạn trên Facebook",
      value: "friends",
    },
    {
      id: "custom",
      icon: <User className="w-5 h-5" />,
      title: "Tùy chỉnh",
      description: "Trần Nam",
      value: "custom",
    },
  ];

  const handleSave = () => {
    onSave(selectedOption);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Quyền riêng tư của tin
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Ai có thể xem tin của bạn?
            </h3>
            <p className="text-sm text-gray-500">
              Tin của bạn sẽ hiển thị trên Facebook và Messenger trong 24 giờ.
            </p>
          </div>

          {/* Privacy Options */}
          <div className="space-y-3">
            {privacyOptions.map((option) => (
              <label
                key={option.id}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mr-3">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {option.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {option.description}
                  </div>
                </div>
                <input
                  type="radio"
                  name="privacy"
                  value={option.value}
                  checked={selectedOption === option.value}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
              </label>
            ))}

            {/* Hide from specific people option */}
            <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mr-3">
                <Eye className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Ẩn tin với</div>
              </div>
              <div className="text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
