import React, { useState } from "react";
import Navbar from "../Components/Home/NavBar";
import Sidebar from "../Components/Chat/Sidebar";
import ChatHeader from "../Components/Chat/ChatHeader";
import ChatMessages from "../Components/Chat/ChatMessage";
import ChatInput from "../Components/Chat/ChatInput";
import ChatInfoPanel from "../Components/Chat/ChatInfoPanel";
import anonymous from "../assets/anonymous.png";
import { useChat } from "../Contexts/ChatContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchConversationIdBetweenTwo } from "../Apis/ChatApi";
import { getProfileApi } from "../Apis/UserApi";
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
  console.log(conversations);
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if (isNewChat) {
        const friendData = friends?.find((f) => f.friend.id === userId)?.friend;
        setSelectedConversation((prev) => {
          if (prev?.id === `friend-${userId}`) return prev; // already selected
          return {
            id: `friend-${userId}`,
            isGroup: false,
            isVirtual: true,
            pictureUrl: friendData?.avatarUrl || anonymous,
            name: friendData
              ? `${friendData.firstName || ""} ${
                  friendData.lastName || ""
                }`.trim()
              : "Loading...",
            members: friendData ? [{ user: friendData, role: "Member" }] : [],
            lastMessage: null,
            unreadCount: 0,
          };
        });

        try {
          const res = await fetchConversationIdBetweenTwo(userId);
          const conversationId = res.data.conversationId;
          navigate("/chat/t/" + conversationId);
        } catch (err) {
          if (
            err.response.data.message !=
            "Conversation between two users not found!"
          )
            return;
          const res = await getProfileApi(userId);
          console.log(res.data);
          const userData = res.data;
          setSelectedConversation({
            id: `friend-${userData.id}`,
            isGroup: false,
            isVirtual: true,
            pictureUrl: userData.avatarUrl || anonymous,
            name: `${userData.firstName || ""} ${
              userData.lastName || ""
            }`.trim(),
            members: [{ user: userData, role: "Member" }],
            lastMessage: null,
            unreadCount: 0,
          });
        }
      } else if (conversationId) {
        fetchConversationById(conversationId);
      }
    };

    fetchData();
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
                members={selectedConversation.members}
              />
              <ChatInput
                conversation={selectedConversation}
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
