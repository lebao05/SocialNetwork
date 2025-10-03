import React from "react";
import dayjs from "dayjs";
import anonymous from "../../assets/anonymous.png";

const ChatMessages = ({
    messages,
    currentUserId,
    messagesContainerRef,
    messagesEndRef,
    handleScroll,
}) => {

    const renderTimestamp = (currentMsg, previousMsg) => {
        if (!previousMsg) return true;
        const diff = dayjs(currentMsg.createdAt).diff(dayjs(previousMsg.createdAt), "minute");
        return diff >= 15;
    };

    const shouldShowName = (currentMsg, previousMsg) => {
        if (!previousMsg) return true;
        return currentMsg.senderId !== previousMsg.senderId || renderTimestamp(currentMsg, previousMsg);
    };

    return (
        <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 bg-gray-50"
        >
            {messages.map((msg, index) => {
                const previousMsg = messages[index - 1];
                const showTimestamp = renderTimestamp(msg, previousMsg);
                const showName = shouldShowName(msg, previousMsg);
                const isCurrentUser = msg.senderId === currentUserId;

                return (
                    <div key={msg.id || `${msg.senderId}-${Math.random()()}`}>
                        {showTimestamp && (
                            <div className="text-center text-xs text-gray-400 my-2">
                                {dayjs(msg.createdAt).format("MMM D, YYYY HH:mm")}
                            </div>
                        )}
                        <div className={`flex ml-11 mb-0 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                            {!isCurrentUser && showName && (
                                <div className="text-xs text-gray-500 mb-1">{msg.senderName}</div>
                            )}
                        </div>
                        <div className={`flex mb-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}>

                            {/* Avatar always on the left for other users */}
                            {!isCurrentUser && (
                                <img
                                    src={msg.senderAvatar || anonymous}
                                    alt={msg.senderName}
                                    className="w-8 h-8 rounded-full mr-2"
                                />
                            )}

                            <div>
                                {/* Name only when sender changed or 15+ min difference */}

                                <div
                                    className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${isCurrentUser
                                        ? "bg-blue-500 text-white rounded-br-none"
                                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                                        }`}
                                >
                                    {msg.content}
                                </div>
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
