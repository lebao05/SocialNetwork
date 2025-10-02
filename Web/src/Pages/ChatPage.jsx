import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useChatApi } from "../Hooks/useChatApi";
import { fetchConversations, fetchMessages } from "../Apis/ChatApi";
import Sidebar from "..//Components/Chat/Sidebar";
import ChatHeader from "../Components/Chat/ChatHeader"
import ChatMessages from "../Components/Chat/ChatMessage";
import ChatInput from "../Components/Chat/ChatInput";
import { getFriends } from "../Redux/Slices/FriendSlice";

const ChatPage = () => {
  const myAuth = useSelector((state) => state.auth.user);
  const currentUserId = myAuth?.id?.toString();

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [pageTracker, setPageTracker] = useState({});
  const [hasMore, setHasMore] = useState({});
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const friends = useSelector(state => state.friend.friends)
  const dispatch = useDispatch();
  // SignalR hook
  const { sendMessage } = useChatApi((message) => {
    setMessages((prev) => ({
      ...prev,
      [message.conversationId]: [
        ...(prev[message.conversationId] || []),
        message,
      ],
    }));

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === message.conversationId
          ? {
            ...conv,
            lastMessage: message,
            unreadCount:
              conv.id === selectedConversation?.id
                ? 0
                : (conv.unreadCount || 0) + 1,
          }
          : conv
      )
    );

    setTimeout(() => {
      const container = messagesContainerRef.current;
      if (
        container &&
        container.scrollHeight - container.scrollTop - container.clientHeight < 50
      ) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  });

  // fetch conversations
  useEffect(() => {
    fetchConversations()
      .then((res) => setConversations(res.data || []))
      .catch((err) => console.error("Failed to fetch conversations:", err));
    dispatch(getFriends());
  }, []);

  // fetch messages when selecting
  useEffect(() => {
    if (!selectedConversation) return;
    fetchMessages(selectedConversation.id, 1, 20)
      .then((res) => {
        setMessages((prev) => ({
          ...prev,
          [selectedConversation.id]: res.data || [],
        }));
        setPageTracker((prev) => ({ ...prev, [selectedConversation.id]: 1 }));
        setHasMore((prev) => ({
          ...prev,
          [selectedConversation.id]: (res.data || []).length > 0,
        }));

        setTimeout(
          () => messagesEndRef.current?.scrollIntoView({ behavior: "auto" }),
          100
        );
      })
      .catch((err) => console.error("Failed to fetch messages:", err));
  }, [selectedConversation]);

  // infinite scroll
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || !selectedConversation) return;

    if (container.scrollTop === 0 && hasMore[selectedConversation.id]) {
      const nextPage = (pageTracker[selectedConversation.id] || 1) + 1;
      const prevHeight = container.scrollHeight;

      fetchMessages(selectedConversation.id, nextPage, 10).then((res) => {
        const newMessages = res.data || [];
        setMessages((prev) => ({
          ...prev,
          [selectedConversation.id]: [
            ...newMessages,
            ...(prev[selectedConversation.id] || []),
          ],
        }));
        setPageTracker((prev) => ({
          ...prev,
          [selectedConversation.id]: nextPage,
        }));
        setHasMore((prev) => ({
          ...prev,
          [selectedConversation.id]: newMessages.length > 0,
        }));

        setTimeout(() => {
          const newHeight = container.scrollHeight;
          container.scrollTop = newHeight - prevHeight;
        }, 50);
      });
    }
  };

  // send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    const newMessage = {
      conversationId: selectedConversation.id,
      content: messageInput,
    };
    sendMessage(newMessage);
    setMessageInput("");
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        myAuth={myAuth}
        conversations={conversations}
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        friends={friends}
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
  );
};

export default ChatPage;
