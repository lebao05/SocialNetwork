import React from "react";
import Navbar from "../Components/Home/NavBar";
import Sidebar from "../Components/Chat/Sidebar";
import ChatHeader from "../Components/Chat/ChatHeader";
import ChatMessages from "../Components/Chat/ChatMessage";
import ChatInput from "../Components/Chat/ChatInput";
import { ChatProvider, useChat } from "../Contexts/ChatContext";

const ChatLayout = () => {
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
  } = useChat();

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex h-full bg-gray-50">
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

        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <ChatHeader selectedConversation={selectedConversation} />
              <ChatMessages
                messages={messages[selectedConversation.id] || []}
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
      </div>
    </div>
  );
};

const ChatPage = () => (
  <ChatProvider>
    <ChatLayout />
  </ChatProvider>
);

export default ChatPage;
