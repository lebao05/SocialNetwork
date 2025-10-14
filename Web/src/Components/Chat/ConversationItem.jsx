import React from "react";
import group from "../../assets/group.png";
import anonymous from "../../assets/anonymous.png";
import { useSelector } from "react-redux";
const ConversationItem = ({ conversation, isSelected, onSelect }) => {
  const myAuth = useSelector((state) => state.auth.user);
  const otherMember = !conversation.isGroup
    ? conversation.members?.find((m) => m.user.id !== myAuth.id)
    : null;
  const conversationName = conversation.isGroup
    ? conversation.name
    : otherMember
    ? `${otherMember.user.firstName} ${otherMember.user.lastName}`
    : "Unknown";
  return (
    <div
      onClick={onSelect}
      className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${
        isSelected ? "bg-gray-200" : ""
      }`}
    >
      <img
        src={
          conversation.pictureUrl
            ? conversation.pictureUrl
            : conversation.isGroup
            ? group
            : anonymous
        }
        alt={conversation.name}
        className="w-10 h-10 rounded-full mr-3"
      />
      <div className="flex-1">
        <div className="font-medium">{conversationName}</div>
        <div className="text-xs text-gray-500 truncate">
          {conversation.lastMessage?.content?.text || "No messages"}
        </div>
      </div>
      {conversation.unreadCount > 0 && (
        <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          {conversation.unreadCount}
        </span>
      )}
    </div>
  );
};

export default ConversationItem;
