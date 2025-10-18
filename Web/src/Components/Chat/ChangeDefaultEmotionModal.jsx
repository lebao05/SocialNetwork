// src/components/ChatInfoPanel/ChangeDefaultEmotionModal.jsx
import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { X } from "lucide-react";
import { useChat } from "../../Contexts/ChatContext";

const ChangeDefaultEmotionModal = ({ conversation, onClose }) => {
  const { changeConversationDetail } = useChat();
  const [selectedEmoji, setSelectedEmoji] = useState(
    conversation?.defaultReaction || "👍"
  );
  const [loading, setLoading] = useState(false);

  const handleEmojiSelect = (emojiData) => {
    setSelectedEmoji(emojiData.emoji);
  };

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await changeConversationDetail({
        conversationId: conversation.id,
        defaultReaction: selectedEmoji,
      });
      onClose();
    } catch (err) {
      console.error("Failed to update emotion:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[400px] flex flex-col p-5 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-4 text-center">
          Change Default Emotion
        </h2>

        {/* Current selection */}
        <div className="flex justify-center items-center gap-3 mb-4">
          <span className="text-3xl">{selectedEmoji}</span>
          <span className="text-gray-500 text-sm">Selected</span>
        </div>

        {/* Emoji Picker */}
        <div className="flex justify-center">
          <EmojiPicker
            onEmojiClick={handleEmojiSelect}
            lazyLoadEmojis
            width={340}
            height={360}
            previewConfig={{ showPreview: false }}
            searchDisabled={false}
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeDefaultEmotionModal;
