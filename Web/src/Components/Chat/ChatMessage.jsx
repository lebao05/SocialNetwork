import React, { useState, useRef, useEffect } from "react";
import anonymous from "../../assets/anonymous.png";
import { MoreHorizontal, Smile, FileText } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useChat } from "../../Contexts/ChatContext";

const EMOJIS = ["❤️", "😂", "👍", "😡", "😢"];

const ChatMessages = ({
  messages,
  currentUserId,
  messagesEndRef,
  members,
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
  const { deleteMessage, ReactToMessage } = useChat();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!containerRef.current?.contains(e.target)) closeAllMenus();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAllMenus = () => {
    setShowOptionsFor(null);
    setShowEmojiBarFor(null);
    setShowFullEmojiPickerFor(null);
  };

  const handleMenuPosition = (
    buttonEl,
    msgId,
    type,
    menuWidth = 150,
    menuHeight = 200
  ) => {
    if (!buttonEl) return;
    const rect = buttonEl.getBoundingClientRect();
    let top = rect.bottom + 8;
    let left = rect.left;
    if (window.innerWidth - rect.right < menuWidth)
      left = rect.right - menuWidth;
    if (window.innerHeight - rect.bottom < menuHeight)
      top = rect.top - menuHeight - 8;
    setMenuPosition((prev) => ({
      ...prev,
      [msgId]: { ...prev[msgId], [type]: { top, left } },
    }));
  };

  const handleReaction = async (msgId, emoji) => {
    try {
      await ReactToMessage(msgId, emoji); // SignalR call or API call
    } catch (err) {
      console.error("ReactToMessage failed", err);
    }
    closeAllMenus();
  };

  const handleOption = (msgId, action) => {
    console.log(`Action "${action}" on message ${msgId}`);
    closeAllMenus();
  };

  const renderAttachment = (attachment) => {
    if (!attachment) return null;
    if (attachment.deleted || attachment.isDeleted) {
      return (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2 mt-1 text-sm italic text-gray-500 max-w-xs">
          Attachment removed
        </div>
      );
    }
    const isImage = attachment.fileType?.startsWith("image/");
    const isVideo = attachment.fileType?.startsWith("video/");
    const isAudio = attachment.fileType?.startsWith("audio/");
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
      <div className="flex items-center bg-gray-100 rounded-lg p-2 mt-1 space-x-2 cursor-pointer">
        <FileText size={20} />
        <span className="text-sm text-gray-700">{attachment.originalName}</span>
      </div>
    );
  };

  const renderReactions = (msg) => {
    if (!msg.userMessageDtos || msg.userMessageDtos.length === 0) return null;

    // Normalize each user's reaction into an array of emoji strings
    const allReactions = msg.userMessageDtos.flatMap((u) => {
      const r = u.reaction;
      if (!r) return []; // null/undefined -> no reactions
      if (Array.isArray(r))
        return r.map((emoji) => ({ emoji, userId: u.userId }));
      // If reaction is an object (rare) try to extract; else treat as single string
      if (typeof r === "object") {
        // if object like { emoji: "❤️" } or { emojis: ["❤️"] }
        if (r.emoji && typeof r.emoji === "string")
          return [{ emoji: r.emoji, userId: u.userId }];
        if (Array.isArray(r.emojis))
          return r.emojis.map((emoji) => ({ emoji, userId: u.userId }));
        // fallback: stringify
        const fallback = String(r);
        return fallback ? [{ emoji: fallback, userId: u.userId }] : [];
      }
      // If it's a simple string like "❤️"
      if (typeof r === "string") return [{ emoji: r, userId: u.userId }];

      return []; // unknown type -> ignore
    });

    if (allReactions.length === 0) return null;

    // Group by emoji -> array of userIds
    // Deduplicate by (userId + emoji)
    const uniqueReactions = [];
    const seen = new Set();
    for (const r of allReactions) {
      const key = `${r.userId}-${r.emoji}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueReactions.push(r);
      }
    }

    // Group by emoji
    const grouped = uniqueReactions.reduce((acc, r) => {
      if (!acc[r.emoji]) acc[r.emoji] = [];
      acc[r.emoji].push(r.userId);
      return acc;
    }, {});

    return (
      <div className="flex space-x-1 mt-1 bg-white/80 rounded-full px-2 py-0.5 text-xs shadow-sm items-center w-fit cursor-pointer">
        {Object.entries(grouped).map(([emoji, userIds]) => {
          const count = userIds.length;
          const names = userIds
            .filter((id) => id !== currentUserId)
            .map((id) => members.find((m) => m.id === id)?.name || "Unknown");
          return (
            <span
              key={emoji}
              className="flex items-center space-x-0.5 relative group"
            >
              <span>{emoji}</span>
              <span>{count}</span>
              {names.length > 0 && (
                <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col bg-gray-100 text-gray-700 text-xs rounded shadow px-2 py-1">
                  {names.join(", ")}
                </div>
              )}
            </span>
          );
        })}
      </div>
    );
  };

  // Render who has seen (except current user)
  const renderSeen = (msg) => {
    if (!msg.userMessageDtos || !Array.isArray(msg.userMessageDtos))
      return null;

    const seenUsers = msg.userMessageDtos
      .filter((um) => um.readAt && um.userId !== currentUserId)
      .map((um) => {
        const member = members.find((m) => m.user.id === um.userId);
        if (!member || !member.user) return "Unknown";
        return `${member.user.firstName} ${member.user.lastName}`;
      });

    if (seenUsers.length === 0) return null;

    // Only show first 3 users max
    const displayed = seenUsers.slice(0, 3);
    const hasMore = seenUsers.length > 3;

    return (
      <div className="text-[11px] text-gray-500 mt-0.5">
        Seen by {displayed.join(", ")}
        {hasMore ? "..." : ""}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 bg-gray-50 relative"
      onClick={() => closeAllMenus()}
    >
      {messages.map((msg, index) => {
        if (msg.isSystemMessage) {
          return (
            <div key={msg.id || index} className="flex justify-center my-3">
              <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                {msg.content}
              </div>
            </div>
          );
        }
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
                {/* Message bubble */}
                {msg.deleted ? (
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-xs text-sm italic text-gray-500 bg-gray-200 ${
                      isCurrentUser ? "text-right" : "text-left"
                    }`}
                  >
                    {isCurrentUser
                      ? "You revoked this message"
                      : "This message was revoked"}
                  </div>
                ) : (
                  msg.content && (
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-xs text-sm break-words relative ${
                        isCurrentUser
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  )
                )}

                {/* Attachment */}
                {msg.attachment && !msg.deleted && (
                  <div className="mt-2">{renderAttachment(msg.attachment)}</div>
                )}

                {/* Reactions */}

                {!msg.deleted && renderReactions(msg)}

                {/* Seen */}
                {!msg.deleted && renderSeen(msg)}

                {/* Hover buttons */}
                {hoveredMsgId === msg.id && !msg.deleted && (
                  <div
                    className={`absolute flex items-center space-x-2 ${
                      isCurrentUser ? "-left-17" : "-right-17"
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
                          "emoji",
                          180,
                          60
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
                          "options",
                          150,
                          100
                        );
                      }}
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                )}

                {/* Emoji bar */}
                {showEmojiBarFor === msg.id && menuPosition[msg.id]?.emoji && (
                  <div
                    style={{
                      position: "fixed",
                      top: menuPosition[msg.id].emoji.top,
                      left: menuPosition[msg.id].emoji.left,
                      zIndex: 9999,
                    }}
                    className="bg-white shadow-md rounded-full px-2 py-1 flex items-center space-x-1"
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

                {/* Full emoji picker */}
                {showFullEmojiPickerFor === msg.id &&
                  menuPosition[msg.id]?.emoji && (
                    <div
                      style={{
                        position: "fixed",
                        top: menuPosition[msg.id].emoji.top,
                        left: menuPosition[msg.id].emoji.left,
                        zIndex: 9999,
                      }}
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

                {/* Options menu */}
                {showOptionsFor === msg.id && menuPosition[msg.id]?.options && (
                  <div
                    style={{
                      position: "fixed",
                      top: menuPosition[msg.id].options.top,
                      left: menuPosition[msg.id].options.left,
                      zIndex: 9999,
                    }}
                    className="bg-white shadow-md rounded-lg p-2 text-sm space-y-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      onClick={() => {
                        deleteMessage(msg.id);
                        setShowOptionsFor(null);
                      }}
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
