import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as signalR from "@microsoft/signalr";
import { createConversationApi, fetchConversations, fetchMessages, uploadFileToSas } from "../Apis/ChatApi";
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

    const [onlineUsers, setOnlineUsers] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState({});
    const [pageTracker, setPageTracker] = useState({});
    const [hasMore, setHasMore] = useState({});
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    const connectionRef = useRef(null);

    // === Setup SignalR Connection ===
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

        connection.on("ReceiveMessage", (message) => {
            setMessages((prev) => ({
                ...prev,
                [message.conversationId]: [
                    ...(prev[message.conversationId] || []),
                    message,
                ],
            }));

            setConversations((prev) => {
                const exists = prev.some((conv) => conv.id === message.conversationId);
                if (!exists) {
                    fetchConversations()
                        .then((res) => setConversations(res.data || []))
                        .catch((err) => console.error("Failed to refresh conversations:", err));
                    return prev;
                }
                return prev.map((conv) =>
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
                );
            });

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

        return () => {
            connection.stop();
        };
    }, [selectedConversation]);

    // === fetch conversations & friends ===
    useEffect(() => {
        fetchConversations()
            .then((res) => setConversations(res.data || []))
            .catch((err) => console.error("Failed to fetch conversations:", err));
        dispatch(getFriends());
    }, []);

    // === fetch messages on conversation select ===
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

    // === infinite scroll ===
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

    // === send message ===
    const handleSendMessage = async (_content = null, files = []) => {
        if ((!_content.trim() && files.length == 0) || !selectedConversation) return;
        let conversationId = selectedConversation.id;

        if (selectedConversation.isVirtual) {
            try {
                const response = await createConversationApi({
                    memberIds: selectedConversation.members.map((m) => m.id),
                    isGroup: false,
                });
                const realConversation = response.data;

                setSelectedConversation({
                    ...selectedConversation,
                    id: realConversation.id,
                    isVirtual: false,
                });
                setConversations((prev) => [realConversation, ...prev]);
                conversationId = realConversation.id;
            } catch (error) {
                console.error("Failed to create conversation:", error);
                return;
            }
        }
        // 1️⃣ Upload all attachments first
        const attachments = files.length > 0
            ? await Promise.all(files.map((file) => uploadFileToSas(file)))
            : [];

        const newMessage = {
            conversationId, content: _content, attachmentIds: attachments.map((a) => a.blobName),
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
                searchQuery,
                setSearchQuery,
                handleSendMessage,
                handleScroll,
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
