import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const ChatInput = ({ messageInput, setMessageInput, handleSendMessage }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const onEmojiClick = (emojiData, event) => {
    setMessageInput(messageInput + emojiData.emoji);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-4 border-t border-gray-200 bg-white gap-2 flex items-center relative">
      <Paperclip className="w-5 h-5 text-gray-500 cursor-pointer" />

      <div className="relative" ref={emojiPickerRef}>
        <Smile
          className="w-5 h-5 text-gray-500 cursor-pointer"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        />

        {showEmojiPicker && (
          <div className="absolute bottom-10 left-0 z-50">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>

      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded-full border text-sm focus:outline-none"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSendMessage();
        }}
      />

      <button
        onClick={handleSendMessage}
        className="ml-2 p-2 rounded-full bg-blue-500 text-white"
      >
        <Send size={18} />
      </button>
    </div>
  );
};

export default ChatInput;
