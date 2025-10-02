import React from "react";
import { Send } from "lucide-react";
import { Paperclip, Smile } from "lucide-react";
const ChatInput = ({ messageInput, setMessageInput, handleSendMessage }) => {
    return (
        <div className="p-4 border-t border-gray-200 bg-white gap-2 flex items-center">
            <Paperclip className="w-5 h-5 text-gray-500 cursor-pointer" />
            <Smile className="w-5 h-5 text-gray-500 cursor-pointer" />
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
