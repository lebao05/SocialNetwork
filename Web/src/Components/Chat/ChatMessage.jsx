
const ChatMessages = ({
    messages,
    currentUserId,
    messagesContainerRef,
    messagesEndRef,
    handleScroll,
}) => {
    return (
        <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 bg-gray-50"
        >
            {messages.map((msg) => (
                <div
                    className={`flex ${msg.senderId == currentUserId ? "justify-end" : "justify-start"} mb-2`}
                >
                    <div
                        className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${msg.senderId == currentUserId
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                            }`}
                    >
                        {msg.content}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages;
