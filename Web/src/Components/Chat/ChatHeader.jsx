import React from "react";
import { Phone, Video, MoreVertical } from "lucide-react";
import group from "../../assets/group.png"
import anonymous from "../../assets/anonymous.png"
const ChatHeader = ({ selectedConversation, onShowInfo }) => {
    return (
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center">
                <img
                    src={selectedConversation.avatarUrl || selectedConversation.isGroup ? group : anonymous}
                    alt={selectedConversation.name}
                    className="w-10 h-10 rounded-full mr-3"
                />
                <span className="font-medium">{selectedConversation.name}</span>
            </div>
            <div className="flex gap-4 text-gray-600">
                <Phone className="cursor-pointer" />
                <Video className="cursor-pointer" />
                <MoreVertical onClick={onShowInfo} className="cursor-pointer" />
            </div>
        </div>
    );
};

export default ChatHeader;
