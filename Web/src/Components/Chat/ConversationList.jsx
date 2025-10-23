import React from "react";
import ConversationItem from "./ConversationItem";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../Contexts/ChatContext";

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
            onSelect={() => {
              if (conv.isVirtual) {
                navigate("/chat/new/" + conv.members[0].user.id);
              } else {
                navigate("/chat/t/" + conv.id);
              }
            }}
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
