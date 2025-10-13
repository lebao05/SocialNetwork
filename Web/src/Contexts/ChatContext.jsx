import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as signalR from "@microsoft/signalr";
import {
  createConversationApi,
  fetchConversationApi,
  fetchConversations,
  fetchMessages,
  uploadFileToSas,
} from "../Apis/ChatApi";
import { getFriends } from "../Redux/Slices/FriendSlice";

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
const HUB_URL = VITE_SERVER_URL + "hubs/chat";

export const ChatProvider = ({ children }) => {
  const myAuth = useSelector((state) => state.auth.user);
  const currentUserId = myAuth?.id?.toString();
  const friends = useSelector((state) => state.friend.friends);
  const dispatch = useDispatch();

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const connectionRef = useRef(null);

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Track latest selectedConversation to avoid stale closure
  const selectedConversationRef = useRef(null);
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  // === Setup SignalR Connection (only once) ===
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = connection;

    connection
      .start()
      .then(() => setIsConnected(true))
      .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      connection.stop();
    };
  }, []);

  // === Register event handlers (depends on selectedConversation) ===
  useEffect(() => {
    const connection = connectionRef.current;
    if (!connection) return;

    // 🟢 Message deleted
    const handleDeleteMessage = (messageId) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, isDeleted: true } : m))
      );
    };

    // 🟢 Attachment deleted
    const handleDeleteAttachment = (attachmentId) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === attachmentId ? { ...m, isDeleted: true } : m))
      );
    };

    // 🟢 Message received
    const handleReceiveMessage = (message) => {
      const currentConv = selectedConversationRef.current;

      if (message.conversationId === currentConv?.id) {
        setMessages((prev) => [...prev, message]);
        setTimeout(
          () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
          100
        );
      }

      setConversations((prev) => {
        // Find the conversation that got the new message
        const updated = prev.map((conv) =>
          conv.id === message.conversationId
            ? {
                ...conv,
                lastMessage: message,
                unreadCount:
                  conv.id === currentConv?.id ? 0 : (conv.unreadCount || 0) + 1,
              }
            : conv
        );

        // Move that conversation to the top of the list
        const convToMove = updated.find((c) => c.id === message.conversationId);
        const others = updated.filter((c) => c.id !== message.conversationId);

        return [convToMove, ...others];
      });
    };

    connection.on("DeleteMessage", handleDeleteMessage);
    connection.on("DeleteAttachment", handleDeleteAttachment);
    connection.on("ReceiveMessage", handleReceiveMessage);

    return () => {
      connection.off("DeleteMessage", handleDeleteMessage);
      connection.off("DeleteAttachment", handleDeleteAttachment);
      connection.off("ReceiveMessage", handleReceiveMessage);
    };
  }, []); // no deps, we use ref instead of state to track selectedConversation

  // === Fetch conversations & friends ===
  useEffect(() => {
    fetchConversations()
      .then((res) => setConversations(res.data || []))
      .catch((err) => console.error("Failed to fetch conversations:", err));
    dispatch(getFriends());
  }, []);

  // === Fetch messages on conversation select ===
  useEffect(() => {
    if (!selectedConversation) return;
    fetchMessages(selectedConversation.id, 1, 20)
      .then((res) => {
        setMessages(res.data || []);
        setPage(1);
        setHasMore((res.data || []).length > 0);
        setTimeout(
          () => messagesEndRef.current?.scrollIntoView({ behavior: "auto" }),
          100
        );
      })
      .catch((err) => console.error("Failed to fetch messages:", err));
  }, [selectedConversation]);

  // === Infinite scroll ===
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || !selectedConversation) return;

    if (container.scrollTop === 0 && hasMore) {
      const nextPage = page + 1;
      const prevHeight = container.scrollHeight;

      fetchMessages(selectedConversation.id, nextPage, 10).then((res) => {
        const newMessages = res.data || [];
        setMessages((prev) => [...newMessages, ...prev]);
        setPage(nextPage);
        setHasMore(newMessages.length > 0);

        setTimeout(() => {
          const newHeight = container.scrollHeight;
          container.scrollTop = newHeight - prevHeight;
        }, 50);
      });
    }
  };

  // === Delete message / attachment ===
  const deleteMessage = async (messageId, conversationId) => {
    try {
      await connectionRef.current?.invoke(
        "DeleteMessage",
        messageId,
        conversationId
      );
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const deleteAttachment = async (attachmentId, conversationId) => {
    try {
      await connectionRef.current?.invoke(
        "DeleteAttachment",
        attachmentId,
        conversationId
      );
    } catch (err) {
      console.error("Failed to delete attachment:", err);
    }
  };

  // === Send message ===
  const handleSendMessage = async (_content = "", files = []) => {
    if ((!_content.trim() && files.length === 0) || !selectedConversation)
      return;
    let conversationId = selectedConversation.id;

    if (selectedConversation.isVirtual) {
      try {
        const response = await createConversationApi({
          memberIds: selectedConversation.members.map((m) => m.id),
          isGroup: false,
        });
        const realConversation = response.data;
        setSelectedConversation(realConversation);
        setConversations((prev) => [realConversation, ...prev]);
        conversationId = realConversation.id;
      } catch (error) {
        console.error("Failed to create conversation:", error);
        return;
      }
    }

    const attachments =
      files.length > 0
        ? await Promise.all(files.map((file) => uploadFileToSas(file)))
        : [];

    const newMessage = {
      conversationId,
      content: _content,
      attachmentIds: attachments.map((a) => a.blobName),
    };

    try {
      await connectionRef.current?.invoke("SendMessage", newMessage);
    } catch (err) {
      console.error("Failed to send message:", err);
    }

    setMessageInput("");
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  const fetchConversationById = async (conversationId) => {
    try {
      const res = await fetchConversationApi(conversationId);
      setSelectedConversation(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        myAuth,
        currentUserId,
        conversations,
        setConversations,
        selectedConversation,
        setSelectedConversation,
        messages,
        setMessages,
        onlineUsers,
        setOnlineUsers,
        messageInput,
        setMessageInput,
        fetchConversationById,
        searchQuery,
        setSearchQuery,
        handleSendMessage,
        handleScroll,
        deleteMessage,
        deleteAttachment,
        messagesContainerRef,
        messagesEndRef,
        friends,
        isConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
