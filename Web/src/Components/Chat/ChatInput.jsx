import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, ThumbsUp, Mic, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const ChatInput = ({
    messageInput,
    setMessageInput,
    handleSendMessage,
    handleSendVoice,
}) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFileIndexes, setSelectedFileIndexes] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const emojiPickerRef = useRef(null);
    const fileInputRef = useRef(null);

    // Emoji selection
    const onEmojiClick = (emojiData) => {
        console.log(emojiData.emoji);
        setMessageInput((prev) => prev + emojiData.emoji);
    };
    const like = "👍";
    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle file selection
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    // Remove file
    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setSelectedFileIndexes((prev) => prev.filter((i) => i !== index));
    };

    // Handle file selection clicks (single, ctrl, shift)
    const handleFileClick = (index, e) => {
        if (e.shiftKey) {
            const lastSelected = selectedFileIndexes[selectedFileIndexes.length - 1] ?? index;
            const range = [Math.min(lastSelected, index), Math.max(lastSelected, index)];
            const newSelection = [];
            for (let i = range[0]; i <= range[1]; i++) newSelection.push(i);
            setSelectedFileIndexes(newSelection);
        } else if (e.ctrlKey || e.metaKey) {
            setSelectedFileIndexes((prev) =>
                prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
            );
        } else {
            setSelectedFileIndexes([index]);
        }
    };

    // Send message + optional files
    const handleSend = async (content = null) => {
        const text = content ?? messageInput;
        if (text.trim() || selectedFiles.length > 0) {
            const filesToSend =
                selectedFileIndexes.length > 0
                    ? selectedFileIndexes.map((i) => selectedFiles[i])
                    : selectedFiles;
            await handleSendMessage(text, filesToSend);
            setMessageInput("");
            setSelectedFiles([]);
            setSelectedFileIndexes([]);
        }
    };

    return (
        <div className="p-3 border-t border-gray-200 bg-white flex flex-col gap-2">
            {/* Selected file preview */}
            {selectedFiles.length > 0 && (
                <div className="flex gap-2 overflow-x-auto mb-2" onMouseUp={() => setIsDragging(false)}>
                    {selectedFiles.map((file, index) => (
                        <div
                            key={index}
                            className={`relative cursor-pointer rounded-md border ${selectedFileIndexes.includes(index)
                                ? "ring-2 ring-blue-500"
                                : "border-gray-300"
                                }`}
                            onMouseDown={() => setIsDragging(true)}
                            onMouseEnter={() => isDragging && handleFileClick(index, { ctrlKey: true })}
                            onClick={(e) => handleFileClick(index, e)}
                        >
                            {file.type.startsWith("image/") ? (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                            ) : (
                                <div className="w-16 h-16 flex items-center justify-center bg-gray-100 text-xs text-gray-700">
                                    {file.name.length > 10 ? file.name.slice(0, 10) + "..." : file.name}
                                </div>
                            )}
                            <X
                                className="absolute -top-2 -right-2 w-4 h-4 text-red-500 cursor-pointer bg-white rounded-full"
                                onClick={() => removeFile(index)}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-2">
                {/* Voice button */}
                <Mic
                    className="w-6 h-6 text-gray-500 cursor-pointer hover:text-blue-500 transition-colors"
                    onClick={handleSendVoice}
                />

                {/* Facebook-style Like button */}
                <ThumbsUp
                    className="w-6 h-6 text-gray-500 cursor-pointer hover:text-blue-500 transition-colors"
                    onClick={() => handleSend("👍")}
                />

                {/* File picker */}
                <div>
                    <Paperclip
                        className="w-6 h-6 text-gray-500 cursor-pointer hover:text-blue-500 transition-colors"
                        onClick={() => fileInputRef.current.click()}
                    />
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                    />
                </div>

                {/* Emoji picker */}
                <div className="relative" ref={emojiPickerRef}>
                    <Smile
                        className="w-6 h-6 text-gray-500 cursor-pointer hover:text-yellow-500 transition-colors"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    />
                    {showEmojiPicker && (
                        <div className="absolute bottom-10 left-0 z-50">
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                </div>

                {/* Text input */}
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-full border text-sm focus:outline-none"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                    }}
                />

                {/* Send button */}
                <button
                    onClick={() => handleSend()}
                    className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};

export default ChatInput;
