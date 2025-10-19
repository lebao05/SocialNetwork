import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, X } from "lucide-react";
import { FaMicrophone, FaCircleStop } from "react-icons/fa6";
import EmojiPicker from "emoji-picker-react";

const ChatInput = ({
  conversation,
  messageInput,
  setMessageInput,
  handleSendMessage,
  handleSendVoice,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFileIndexes, setSelectedFileIndexes] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedURL, setRecordedURL] = useState("");

  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const timerRef = useRef(null);
  const isCanceled = useRef(false); // flag to skip onstop after cancel

  // ⏱️ Timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(
        () => setRecordingTime((t) => t + 1),
        1000
      );
    } else {
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  // 🎙️ Start recording
  const startRecording = async () => {
    setIsRecording(true);
    isCanceled.current = false; // reset cancel flag
    chunks.current = [];
    try {
      setRecordingTime(0);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        if (isCanceled.current) {
          chunks.current = [];
          isCanceled.current = false;
          return; // skip creating URL or sending
        }

        const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(recordedBlob);
        setRecordedURL(url);

        const audioFile = new File([recordedBlob], `voice-${Date.now()}.webm`, {
          type: "audio/webm",
        });

        if (handleSendVoice) await handleSendVoice(audioFile);

        // Stop all tracks
        mediaStream.current.getTracks().forEach((track) => track.stop());
        chunks.current = [];
      };

      mediaRecorder.current.start();
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Please allow microphone access to record voice messages.");
      setIsRecording(false);
    }
  };

  // 🎙️ Stop recording
  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
  };

  // ❌ Cancel recording
  const cancelRecording = () => {
    isCanceled.current = true;
    setIsRecording(false);
    setRecordedURL("");
    setRecordingTime(0);
    chunks.current = [];
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
    }
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // 😃 Emoji
  const onEmojiClick = (emojiData) =>
    setMessageInput((prev) => prev + emojiData.emoji);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 📎 File
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setSelectedFileIndexes((prev) => prev.filter((i) => i !== index));
  };

  const handleFileClick = (index, e) => {
    if (e.shiftKey) {
      const lastSelected =
        selectedFileIndexes[selectedFileIndexes.length - 1] ?? index;
      const range = [
        Math.min(lastSelected, index),
        Math.max(lastSelected, index),
      ];
      setSelectedFileIndexes(
        [...Array(range[1] - range[0] + 1)].map((_, i) => i + range[0])
      );
    } else if (e.ctrlKey || e.metaKey) {
      setSelectedFileIndexes((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setSelectedFileIndexes([index]);
    }
  };
  const handleSendRecordedVoice = async () => {
    if (!recordedURL) return; // nothing to send

    const recordedBlob = await fetch(recordedURL).then((res) => res.blob());
    const audioFile = new File([recordedBlob], `voice-${Date.now()}.webm`, {
      type: "audio/webm",
    });

    // Send using handleSendMessage with optional text (can be empty)
    await handleSendMessage("", [audioFile]);

    // Reset state
    setRecordedURL("");
    setIsRecording(false);
    setRecordingTime(0);
    chunks.current = [];
  };
  // 💬 Send
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
      // Reset recording after send
      cancelRecording();
    }
  };

  return (
    <div className="p-3 border-t border-gray-200 bg-white flex flex-col gap-2">
      {/* File preview */}
      {selectedFiles.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mb-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className={`relative cursor-pointer rounded-md border ${
                selectedFileIndexes.includes(index)
                  ? "ring-2 ring-blue-500"
                  : "border-gray-300"
              }`}
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
                  {file.name.length > 10
                    ? file.name.slice(0, 10) + "..."
                    : file.name}
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

      <div className="p-3 border-t border-gray-200 bg-white flex flex-col gap-2">
        {/* Voice Recording */}
        {isRecording ? (
          <div className="flex items-center justify-between bg-red-100 p-3 rounded-lg gap-2">
            {/* ❌ Cancel */}
            <button
              onClick={cancelRecording}
              className="p-2 rounded-full bg-gray-300 text-black hover:bg-gray-400"
            >
              <X size={18} />
            </button>

            <span className="text-red-500 font-semibold flex-1 text-center">
              {formatTime(recordingTime)}
            </span>

            <button
              onClick={stopRecording}
              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              <FaCircleStop size={20} />
            </button>
          </div>
        ) : recordedURL ? (
          // Recorded audio preview
          <div className="flex items-center gap-2">
            <button
              onClick={cancelRecording}
              className="p-2 rounded-full bg-gray-300 text-black hover:bg-gray-400"
            >
              <X size={18} />
            </button>
            <audio controls src={recordedURL} className="flex-1" />
            <button
              onClick={() => handleSendRecordedVoice()}
              className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        ) : (
          // Normal chat input
          <div className="flex items-center gap-2">
            {/* 🎙️ Mic button */}
            <div className="flex flex-col items-center">
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={() => isRecording && stopRecording()}
                className={`${
                  isRecording ? "bg-red-500" : "bg-blue-500"
                } flex items-center justify-center rounded-full p-2 w-[30px] h-[30px] text-white text-xl transition-colors`}
              >
                {isRecording ? <FaCircleStop /> : <FaMicrophone />}
              </button>
              {isRecording && (
                <span className="text-xs mt-1 text-red-500">
                  {formatTime(recordingTime)}
                </span>
              )}
            </div>

            {/* 📎 File */}
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

            {/* 😃 Emoji */}
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

            {/* 💬 Text input */}
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

            {/* 👍 Quick Reaction */}
            <span
              onClick={() => handleSend(conversation.defaultReaction || "👍")}
              className="text-3xl cursor-pointer select-none hover:scale-125 transition-transform duration-150"
            >
              {conversation.defaultReaction || "👍"}
            </span>

            {/* 📤 Send */}
            <button
              onClick={() => handleSend()}
              className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
