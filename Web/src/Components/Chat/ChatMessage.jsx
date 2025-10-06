import React from "react";
import dayjs from "dayjs";
import anonymous from "../../assets/anonymous.png";
import { FileText } from 'lucide-react';
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
    const downloadFile = async (url, filename) => {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch file");
            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();

            // Revoke blob URL after a short delay
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
        } catch (err) {
            console.error("Download failed:", err);
        }
    };

    const shouldShowName = (currentMsg, previousMsg) => {
        if (!previousMsg) return true;
        return currentMsg.senderId !== previousMsg.senderId || renderTimestamp(currentMsg, previousMsg);
    };
    const renderAttachment = (attachment) => {
        const isImage = attachment.fileType.startsWith("image/");
        const isVideo = attachment.fileType.startsWith("video/");
        const isAudio = attachment.fileType.startsWith("audio/");

        if (isImage) {
            return (
                <a href={attachment.blobUrl} target="_blank" rel="noopener noreferrer">
                    <img
                        src={attachment.blobUrl}
                        alt={attachment.originalName}
                        className="max-w-xs max-h-60 rounded-lg mt-1 cursor-pointer"
                    />
                </a>
            );
        }

        if (isVideo) {
            return (
                <video
                    src={attachment.blobUrl}
                    controls
                    className="max-w-xs max-h-60 rounded-lg mt-1"
                />
            );
        }

        if (isAudio) {
            return (
                <audio controls className="mt-1">
                    <source src={attachment.blobUrl} type={attachment.fileType} />
                    Your browser does not support the audio element.
                </audio>
            );
        }

        // Fallback for docs, pdf, etc. — Facebook-style card
        // Fallback for docs, pdf, etc. — Facebook-style card with download
        return (
            <a
                onClick={() => downloadFile(attachment.blobUrl, attachment.originalName)}
                className="flex items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm mt-1 space-x-3 cursor-pointer max-w-xs"
            >
                <div className="flex-shrink-0">
                    <FileText size={24} />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{attachment.originalName}</span>
                    <span className="text-xs text-gray-500">{Math.round(attachment.size / 1024)} KB</span>
                </div>
            </a>
        );

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
                    <div key={msg.id || `${msg.senderId}-${index}`}>
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
                            {!isCurrentUser && (
                                <img
                                    src={msg.senderAvatar || anonymous}
                                    alt={msg.senderName}
                                    className="w-8 h-8 rounded-full mr-2"
                                />
                            )}

                            <div>
                                {/* Message bubble */}
                                {msg.content && (
                                    <div
                                        className={`px-4 py-2 rounded-2xl max-w-xs text-sm break-words ${isCurrentUser
                                            ? "bg-blue-500 text-white rounded-br-none"
                                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                )}

                                {/* Attachments */}
                                {msg.attachments?.length > 0 && (
                                    <div className="flex flex-col space-y-2 mt-1">
                                        {msg.attachments.map((att, i) => (
                                            <div key={i}>{renderAttachment(att)}</div>
                                        ))}
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
