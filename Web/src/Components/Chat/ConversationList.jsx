import React from "react";
import ConversationItem from "./ConversationItem";
import { useNavigate } from "react-router-dom";

const ConversationList = ({ conversations, selectedConversation }) => {
  const navigate = useNavigate();
  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => {
        return (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isSelected={selectedConversation?.id === conv.id}
            onSelect={() => navigate("/chat/t/" + conv.id)}
          />
        );
      })}
      {conversations.length === 0 && (
        <div className="text-center text-gray-400 p-4">No conversations</div>
      )}
    </div>
  );
};

export default ConversationList;
