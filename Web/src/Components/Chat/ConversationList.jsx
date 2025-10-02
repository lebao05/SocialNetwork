import React from "react";
import ConversationItem from "./ConversationItem";

const ConversationList = ({
    conversations,
    selectedConversation,
    setSelectedConversation,
    searchQuery,
}) => {
    const filtered = conversations.filter((c) =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 overflow-y-auto">
            {filtered.map((conv) => (
                <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isSelected={selectedConversation?.id === conv.id}
                    onSelect={() => setSelectedConversation(conv)}
                />
            ))}
            {filtered.length === 0 && (
                <div className="text-center text-gray-400 p-4">No conversations</div>
            )}
        </div>
    );
};

export default ConversationList;
