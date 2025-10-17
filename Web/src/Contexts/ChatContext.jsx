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
import messageSound from "../assets/messageSound.wav";
import { getFriends } from "../Redux/Slices/FriendSlice";

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
const HUB_URL = VITE_SERVER_URL + "hubs/chat";

export const ChatProvider = ({ children }) => {
  const myAuth = useSelector((state) => state.auth.user);
  const messageAudio = useRef(new Audio(messageSound));
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
  useEffect(() => {
    const enableSound = () => {
      messageAudio.current.play().then(() => {
        messageAudio.current.pause();
        messageAudio.current.currentTime = 0;
        document.removeEventListener("click", enableSound);
      });
    };
    document.addEventListener("click", enableSound);
  }, []);
  // === Register event handlers (depends on selectedConversation) ===
  useEffect(() => {
    const connection = connectionRef.current;
    if (!connection) return;

    // Delete entire message
    const handleDeleteMessage = (messageId) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, deleted: true } : m))
      );
    };

    // Delete a specific attachment inside a message
    const handleDeleteAttachment = (attachmentId) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (!m.attachments) return m;

          const updatedAttachments = m.attachments.map((att) =>
            att.id === attachmentId ? { ...att, deleted: true } : att
          );

          return { ...m, attachments: updatedAttachments };
        })
      );
    };

    // 🟢 Message received
    // 🟢 Message received
    const handleReceiveMessage = (message) => {
      const currentConv = selectedConversationRef.current;

      // 🔊 Play sound if message is NOT sent by current user
      if (message.senderId !== currentUserId) {
        messageAudio.current.currentTime = 0; // rewind
        messageAudio.current.play().catch(() => {}); // ignore blocked autoplay
      }

      if (message.conversationId === currentConv?.id) {
        setMessages((prev) => [...prev, message]);
        setTimeout(
          () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
          100
        );
        MarkMessageAsReaded(message.conversationId);
      }

      setConversations((prev) => {
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

        const convToMove = updated.find((c) => c.id === message.conversationId);
        const others = updated.filter((c) => c.id !== message.conversationId);

        return [convToMove, ...others];
      });
    };

    const handleReactToMessage = (userMessageDto) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== userMessageDto.messageId) return msg;

          const existing = msg.userMessageDtos?.find(
            (um) => um.userId === userMessageDto.userId
          );

          if (existing) {
            // ✅ Update existing user's reaction
            return {
              ...msg,
              userMessageDtos: msg.userMessageDtos.map((um) =>
                um.userId === userMessageDto.userId
                  ? { ...um, reaction: userMessageDto.reaction }
                  : um
              ),
            };
          } else {
            // ✅ Add new entry if missing
            return {
              ...msg,
              userMessageDtos: [
                ...(msg.userMessageDtos || []),
                { ...userMessageDto },
              ],
            };
          }
        })
      );
    };

    const handleMarkMessageReaded = (userMessages) => {
      setMessages((prev) =>
        prev.map((msg) => {
          const updated = userMessages.find((um) => um.messageId === msg.id);
          if (!updated) return msg;

          // Check if the current user already has a record in userMessageDtos
          const existing = msg.userMessageDtos?.find(
            (um) => um.userId === currentUserId
          );

          // If exists → update readAt
          if (existing) {
            return {
              ...msg,
              userMessageDtos: msg.userMessageDtos.map((um) =>
                um.userId === currentUserId
                  ? { ...um, readAt: updated.readAt }
                  : um
              ),
            };
          }

          // If not exists → add new userMessageDto
          return {
            ...msg,
            userMessageDtos: [...(msg.userMessageDtos || []), updated],
          };
        })
      );
    };
    const handleLeaveGroup = (userId) => {
      setSelectedConversation((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          members: prev.members.filter((m) => m.id !== userId),
        };
      });
    };

    const handleAddToGroup = (member) => {
      setSelectedConversation((prev) => {
        if (!prev) return prev;
        console.log({ ...prev, members: [...prev.members, member] });
        return { ...prev, members: [...prev.members, member] };
      });
    };
    const handleChangeConversationDetail = (updated) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== updated.conversationId) return c;

          // merge only non-null fields
          const newData = { ...c };
          if (updated.name !== null && updated.name !== undefined)
            newData.name = updated.name;
          if (updated.pictureUrl !== null && updated.pictureUrl !== undefined)
            newData.pictureUrl = updated.pictureUrl;
          if (
            updated.defaultReaction !== null &&
            updated.defaultReaction !== undefined
          )
            newData.defaultReaction = updated.defaultReaction;

          return newData;
        })
      );

      // Update selectedConversation safely
      setSelectedConversation((prev) => {
        if (!prev || prev.id !== updated.conversationId) return prev;

        const newData = { ...prev };
        if (updated.name !== null && updated.name !== undefined)
          newData.name = updated.name;
        if (updated.pictureUrl !== null && updated.pictureUrl !== undefined)
          newData.pictureUrl = updated.pictureUrl;
        if (
          updated.defaultReaction !== null &&
          updated.defaultReaction !== undefined
        )
          newData.defaultReaction = updated.defaultReaction;

        return newData;
      });
    };
    const handleChangeAlias = (dto) => {
      // dto: { conversationId, userId, alias }

      setSelectedConversation((prev) => {
        if (!prev || prev.id !== dto.conversationId) return prev;
        return {
          ...prev,
          members: prev.members.map((m) =>
            m.user.id === dto.userId ? { ...m, alias: dto.alias } : m
          ),
        };
      });

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== dto.conversationId) return c;
          return {
            ...c,
            members: c.members.map((m) =>
              m.user.id === dto.userId ? { ...m, alias: dto.alias } : m
            ),
          };
        })
      );
    };
    connection.on("DeleteMessage", handleDeleteMessage);
    connection.on("DeleteAttachment", handleDeleteAttachment);
    connection.on("ReceiveMessage", handleReceiveMessage);
    connection.on("MarkAsRead", handleMarkMessageReaded);
    connection.on("ReactToMessage", handleReactToMessage);
    connection.on("LeaveGroup", handleLeaveGroup);
    connection.on("AddToGroup", handleAddToGroup);
    connection.on("ChangeConversationDetail", handleChangeConversationDetail);
    connection.on("ChangeAlias", handleChangeAlias);

    return () => {
      connection.off("DeleteMessage", handleDeleteMessage);
      connection.off("DeleteAttachment", handleDeleteAttachment);
      connection.off("ReceiveMessage", handleReceiveMessage);
      connection.off("MarkAsRead", handleMarkMessageReaded);
      connection.off("ReactToMessage", handleReactToMessage);
      connection.off("LeaveGroup", handleLeaveGroup);
      connection.off("AddToGroup", handleAddToGroup);
      connection.off(
        "ChangeConversationDetail",
        handleChangeConversationDetail
      );
      connection.off("ChangeAlias", handleChangeAlias);
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
        MarkMessageAsReaded(selectedConversation.id);
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
  const deleteMessage = async (messageId) => {
    try {
      await connectionRef.current?.invoke("DeleteMessage", messageId);
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };
  const ReactToMessage = async (messageId, reaction) => {
    try {
      await connectionRef.current?.invoke("ReactToMessage", {
        messageId,
        reaction,
      });
    } catch (err) {
      console.error("Failed to react to message:", err);
    }
  };
  const MarkMessageAsReaded = async (conversationId) => {
    try {
      await connectionRef.current?.invoke(
        "MarkMessageAsReaded",
        conversationId
      );
    } catch (err) {
      console.error("Failed to mark message as readed:", err);
    }
  };
  const deleteAttachment = async (attachmentId) => {
    try {
      await connectionRef.current?.invoke("DeleteAttachment", attachmentId);
    } catch (err) {
      console.error("Failed to delete attachment:", err);
    }
  };

  // === Send message ===
  const handleSendMessage = async (_content = "", files = []) => {
    if ((!_content.trim() && files.length === 0) || !selectedConversation)
      return;

    let conversationId = selectedConversation.id;

    // 🧩 Create a real conversation if it's virtual
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

    try {
      // 1️⃣ Send text message first (if provided)
      if (_content.trim()) {
        const textMessage = {
          conversationId,
          content: _content.trim(),
          attachment: null,
        };
        await connectionRef.current?.invoke("SendMessage", textMessage);
      }

      // 2️⃣ Then send each file as a separate message
      for (const file of files) {
        const uploaded = await uploadFileToSas(file);
        const fileMessage = {
          conversationId,
          content: "", // no text for attachment-only message
          attachment: uploaded.blobName,
        };
        await connectionRef.current?.invoke("SendMessage", fileMessage);
      }

      // 3️⃣ Reset input and scroll to bottom
      setMessageInput("");
      setTimeout(
        () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const fetchConversationById = async (conversationId) => {
    try {
      const res = await fetchConversationApi(conversationId);
      setSelectedConversation(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 🟥 Leave conversation
  const leaveConversation = async (conversationId) => {
    if (!conversationId) return;

    try {
      const connection = connectionRef.current;
      if (!connection) throw new Error("Not connected");

      // Call hub method
      await connection.invoke("LeaveConversation", conversationId);
    } catch (err) {
      console.error("Failed to leave conversation:", err);
    }
  };

  // 🟩 Add user to conversation
  const addToConversation = async (conversationId, userId) => {
    if (!conversationId || !userId) return;
    try {
      const connection = connectionRef.current;
      if (!connection) throw new Error("Not connected");

      const dto = { ConversationId: conversationId, UserId: userId };
      await connection.invoke("AddToGroup", dto);
    } catch (err) {
      console.error("Failed to add user to conversation:", err);
    }
  }; // 🟨 Change conversation details (name, picture, reaction)
  const changeConversationDetail = async ({
    conversationId,
    name,
    pictureUrl,
    defaultReaction,
  }) => {
    if (!conversationId) return;

    try {
      const dto = {
        ConversationId: conversationId,
        Name: name || null,
        PictureUrl: pictureUrl || null,
        DefaultReaction: defaultReaction || null,
      };

      await connectionRef.current?.invoke("ChangeConversationDetail", dto);
    } catch (err) {
      console.error("Failed to change conversation details:", err);
    }
  };
  // 🟦 Change alias for a specific member in a conversation
  const changeMemberAlias = async (conversationId, userId, alias) => {
    if (!conversationId || !userId) return;
    try {
      const dto = {
        ConversationId: conversationId,
        UserId: userId,
        Alias: alias || null,
      };
      await connectionRef.current?.invoke("ChangeAlias", dto);
    } catch (err) {
      console.error("Failed to change member alias:", err);
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
        ReactToMessage,
        MarkMessageAsReaded,
        leaveConversation,
        addToConversation,
        changeConversationDetail,
        changeMemberAlias,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
