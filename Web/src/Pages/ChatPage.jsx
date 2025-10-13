import React, { useState } from "react";
import Navbar from "../Components/Home/NavBar";
import Sidebar from "../Components/Chat/Sidebar";
import ChatHeader from "../Components/Chat/ChatHeader";
import ChatMessages from "../Components/Chat/ChatMessage";
import ChatInput from "../Components/Chat/ChatInput";
import ChatInfoPanel from "../Components/Chat/ChatInfoPanel";
import { useChat } from "../Contexts/ChatContext";
import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
const ChatLayout = ({ isNewChat = false }) => {
  const { conversationId, userId } = useParams();
  const location = useLocation();

  const {
    selectedConversation,
    currentUserId,
    conversations,
    setConversations,
    setSelectedConversation,
    myAuth,
    searchQuery,
    setSearchQuery,
    friends,
    messages,
    handleScroll,
    messagesContainerRef,
    messagesEndRef,
    messageInput,
    setMessageInput,
    handleSendMessage,
    fetchConversationById,
  } = useChat();

  const [showInfo, setShowInfo] = useState(false);
  useEffect(() => {
    if (isNewChat) {
    } else if (conversationId) {
      fetchConversationById(conversationId);
    }
  }, [conversationId, isNewChat, location.search]);
  return (
    <div className="h-screen flex flex-col">
      <div className="absolute top-0 left-0 w-full h-[10%] z-20">
        <Navbar />
      </div>
      <div className="flex h-[90%] mt-17 bg-gray-50">
        <Sidebar
          myAuth={myAuth}
          conversations={conversations}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          friends={friends}
          setConversations={setConversations}
        />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative">
          {selectedConversation ? (
            <>
              <ChatHeader
                selectedConversation={selectedConversation}
                onShowInfo={() => setShowInfo(!showInfo)}
              />
              <ChatMessages
                messages={messages}
                currentUserId={currentUserId}
                messagesContainerRef={messagesContainerRef}
                messagesEndRef={messagesEndRef}
                handleScroll={handleScroll}
              />
              <ChatInput
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                handleSendMessage={handleSendMessage}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-xl">
              Select a conversation
            </div>
          )}
        </div>

        {/* Info Panel */}
        {showInfo && (
          <ChatInfoPanel
            conversation={selectedConversation}
            onClose={() => setShowInfo(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
