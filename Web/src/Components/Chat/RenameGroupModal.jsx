import React, { useState } from "react";
import { X } from "lucide-react";
import { useChat } from "../../Contexts/ChatContext";

const RenameGroupModal = ({ conversation, onClose }) => {
  const [groupName, setGroupName] = useState(conversation?.name || "");
  const [error, setError] = useState("");
  const { changeConversationDetail } = useChat(); // ✅ get from context
  const handleSave = async () => {
    if (!groupName.trim()) {
      setError("An empty name isn't allowed!.");
      return;
    }
    try {
      await changeConversationDetail({
        conversationId: conversation.id,
        name: groupName.trim(),
        pictureUrl: null,
        defaultReaction: null,
      });

      setError("");
      onClose(); // close modal
    } catch (err) {
      console.error("Failed to rename group:", err);
      setError("Failed to change group name. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#242526] text-white w-[400px] rounded-xl p-5 relative shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-[#3a3b3c]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold text-center mb-3">
          Change Group Name
        </h2>

        <p className="text-gray-400 text-sm mb-4 text-center">
          Everyone in this group will see this update immediately.
        </p>

        {/* Input */}
        <div>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter a new group name"
            className="w-full bg-[#3a3b3c] border border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 rounded-lg px-3 py-2 outline-none"
            maxLength={500}
          />
          <div className="flex justify-end text-gray-500 text-xs mt-1">
            {groupName.length}/500
          </div>
          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="bg-[#3a3b3c] text-white px-5 py-2 rounded-lg hover:bg-[#4e4f50] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!groupName.trim()}
            className={`px-5 py-2 rounded-lg transition ${
              groupName.trim()
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600/50 text-gray-300 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameGroupModal;
