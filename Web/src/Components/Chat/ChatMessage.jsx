import React, { useState, useRef, useEffect } from "react";
import anonymous from "../../assets/anonymous.png";
import { MoreHorizontal, Smile, FileText } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const EMOJIS = ["❤️", "😂", "👍", "😡", "😢"];

const ChatMessages = ({
  messages,
  currentUserId,
  messagesEndRef,
  handleScroll,
}) => {
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [showOptionsFor, setShowOptionsFor] = useState(null);
  const [showEmojiBarFor, setShowEmojiBarFor] = useState(null);
  const [showFullEmojiPickerFor, setShowFullEmojiPickerFor] = useState(null);
  const [menuPosition, setMenuPosition] = useState({});
  const containerRef = useRef(null);
  const smileRefs = useRef({});
  const dotRefs = useRef({});

  // ✅ Close all menus when clicking outside the chat container
  useEffect(() => {
    const handleClickOutside = (e) => {
      // if click is outside chat area, close all menus
      if (!containerRef.current?.contains(e.target)) {
        closeAllMenus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper: close all menus
  const closeAllMenus = () => {
    setShowOptionsFor(null);
    setShowEmojiBarFor(null);
    setShowFullEmojiPickerFor(null);
  };

  // ✅ Smartly decide position of floating menus
  const handleMenuPosition = (buttonEl, msgId, type) => {
    if (!buttonEl) return;
    const rect = buttonEl.getBoundingClientRect();
    const spaceRight = window.innerWidth - rect.right;
    const isOverflowing = spaceRight < 150;
    setMenuPosition((prev) => ({
      ...prev,
      [msgId]: { ...prev[msgId], [type]: isOverflowing ? "right-0" : "left-0" },
    }));
  };

  const handleReaction = (msgId, emoji) => {
    console.log(`Reacted ${emoji} to message ${msgId}`);
    closeAllMenus();
  };

  const handleOption = (msgId, action) => {
    console.log(`Action "${action}" on message ${msgId}`);
    closeAllMenus();
  };

  const renderAttachment = (attachment) => {
    const isImage = attachment.fileType.startsWith("image/");
    const isVideo = attachment.fileType.startsWith("video/");
    const isAudio = attachment.fileType.startsWith("audio/");

    if (isImage)
      return (
        <img
          src={attachment.blobUrl}
          alt={attachment.originalName}
          className="max-w-xs max-h-60 rounded-lg mt-1 cursor-pointer"
        />
      );
    if (isVideo)
      return (
        <video
          src={attachment.blobUrl}
          controls
          className="max-w-xs max-h-60 rounded-lg mt-1"
        />
      );
    if (isAudio)
      return (
        <audio controls className="mt-1">
          <source src={attachment.blobUrl} type={attachment.fileType} />
        </audio>
      );
    return (
      <div className="flex items-center bg-gray-100 rounded-lg p-2 mt-1 space-x-2 cursor-pointer max-w-xs">
        <FileText size={20} />
        <span className="text-sm text-gray-700">{attachment.originalName}</span>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 bg-gray-50 relative"
      onClick={() => closeAllMenus()} // ✅ click on empty chat area closes menus
    >
      {messages.map((msg, index) => {
        const isCurrentUser = msg.senderId === currentUserId;

        return (
          <div
            key={msg.id || index}
            className="relative"
            onMouseEnter={() => setHoveredMsgId(msg.id)}
            onMouseLeave={() => setHoveredMsgId(null)}
          >
            <div
              className={`flex mb-2 ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isCurrentUser && (
                <img
                  src={msg.senderAvatar || anonymous}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}

              <div className="relative">
                {/* 💬 Message bubble */}
                {msg.content && (
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-xs text-sm break-words relative ${
                      isCurrentUser
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                    onClick={(e) => e.stopPropagation()} // prevent message click from closing menu
                  >
                    {msg.content}
                  </div>
                )}

                {/* 📎 Attachments */}
                {msg.attachments?.length > 0 && (
                  <div className="flex flex-col space-y-2 mt-1">
                    {msg.attachments.map((att, i) => (
                      <div key={i}>{renderAttachment(att)}</div>
                    ))}
                  </div>
                )}

                {/* 🎛️ Hover Buttons */}
                {hoveredMsgId === msg.id && (
                  <div
                    className={`absolute flex items-center space-x-2 ${
                      isCurrentUser ? "-left-17" : "-right-12"
                    } top-1/2 -translate-y-1/2`}
                  >
                    <button
                      ref={(el) => (smileRefs.current[msg.id] = el)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowOptionsFor(null);
                        setShowFullEmojiPickerFor(null);
                        setShowEmojiBarFor(
                          showEmojiBarFor === msg.id ? null : msg.id
                        );
                        handleMenuPosition(
                          smileRefs.current[msg.id],
                          msg.id,
                          "emoji"
                        );
                      }}
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <Smile size={18} />
                    </button>

                    <button
                      ref={(el) => (dotRefs.current[msg.id] = el)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowEmojiBarFor(null);
                        setShowFullEmojiPickerFor(null);
                        setShowOptionsFor(
                          showOptionsFor === msg.id ? null : msg.id
                        );
                        handleMenuPosition(
                          dotRefs.current[msg.id],
                          msg.id,
                          "options"
                        );
                      }}
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                )}

                {/* ⚙️ Options Menu */}
                {showOptionsFor === msg.id && (
                  <div
                    className={`absolute bg-white shadow-md rounded-lg p-2 text-sm space-y-1 z-20 ${
                      menuPosition[msg.id]?.options === "right-0"
                        ? "right-0"
                        : "left-0"
                    } top-0 translate-y-[-110%]`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      onClick={() => handleOption(msg.id, "revoke")}
                      className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded-md"
                    >
                      Revoke
                    </div>
                    <div
                      onClick={() => handleOption(msg.id, "forward")}
                      className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded-md"
                    >
                      Forward
                    </div>
                  </div>
                )}

                {/* 😊 Quick Emoji Bar */}
                {showEmojiBarFor === msg.id && (
                  <div
                    className={`absolute bg-white shadow-md rounded-full px-2 py-1 flex items-center space-x-1 z-20 top-[-45px] ${
                      menuPosition[msg.id]?.emoji === "right-0"
                        ? "right-0"
                        : "left-0"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {EMOJIS.map((emoji) => (
                      <span
                        key={emoji}
                        className="cursor-pointer text-lg hover:scale-125 transition-transform"
                        onClick={() => handleReaction(msg.id, emoji)}
                      >
                        {emoji}
                      </span>
                    ))}
                    <span
                      className="cursor-pointer text-lg hover:scale-125"
                      onClick={() => {
                        setShowFullEmojiPickerFor(
                          showFullEmojiPickerFor === msg.id ? null : msg.id
                        );
                        setShowEmojiBarFor(null);
                      }}
                    >
                      ➕
                    </span>
                  </div>
                )}

                {/* 🧩 Full Emoji Picker */}
                {showFullEmojiPickerFor === msg.id && (
                  <div
                    className={`absolute z-30 ${
                      menuPosition[msg.id]?.emoji === "right-0"
                        ? "right-0"
                        : "left-0"
                    } top-[-370px]`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <EmojiPicker
                      onEmojiClick={(emojiData) =>
                        handleReaction(msg.id, emojiData.emoji)
                      }
                      width={300}
                      height={350}
                      searchDisabled
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
