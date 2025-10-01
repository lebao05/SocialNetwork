import React, { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { MessageCircle, Send, Users, Phone, Video, MoreVertical, Search, Paperclip, Smile, Settings } from 'lucide-react';
import { useSelector } from 'react-redux';

// API URLs
const API_BASE_URL = 'https://localhost:7056/api';
const HUB_URL = 'https://localhost:7056/hubs/chat';

const ChatPageDemo = () => {
    const myAuth = useSelector(state => state.auth.user);
    const currentUserId = myAuth?.id?.toString();

    const connectionRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const messagesEndRef = useRef(null);

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState({});
    const [pageTracker, setPageTracker] = useState({});
    const [hasMore, setHasMore] = useState({});
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // ----------------- SignalR Connection -----------------
    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
                withCredentials: true
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connectionRef.current = connection;

        connection.start().catch(err => console.error('SignalR connection error:', err));

        connection.on('ReceiveMessage', (message) => {
            setMessages(prev => ({
                ...prev,
                [message.conversationId]: [...(prev[message.conversationId] || []), message]
            }));

            setConversations(prev => prev.map(conv =>
                conv.id === message.conversationId
                    ? { ...conv, lastMessage: message, unreadCount: conv.id === selectedConversation?.id ? 0 : (conv.unreadCount || 0) + 1 }
                    : conv
            ));

            // Scroll only if user is at the bottom
            setTimeout(() => {
                const container = messagesContainerRef.current;
                if (container && container.scrollHeight - container.scrollTop - container.clientHeight < 50) {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        });

        return () => {
            connection.stop();
        };
    }, [selectedConversation]);

    // ----------------- Fetch Conversations -----------------
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/chat/conversations`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await res.json();
                setConversations(data.data || []);
            } catch (err) {
                console.error('Failed to fetch conversations:', err);
            }
        };
        fetchConversations();
    }, []);

    // ----------------- Fetch Messages -----------------
    const fetchMessages = async (conversationId, page = 1, append = false) => {
        try {
            const res = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/messages?page=${page}&pageSize=15`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            const newMessages = data.data || [];

            setMessages(prev => ({
                ...prev,
                [conversationId]: append
                    ? [...newMessages, ...(prev[conversationId] || [])] // prepend older
                    : newMessages
            }));

            setPageTracker(prev => ({ ...prev, [conversationId]: page }));
            setHasMore(prev => ({ ...prev, [conversationId]: newMessages.length > 0 }));
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        }
    };

    // ----------------- On Conversation Select -----------------
    useEffect(() => {
        if (!selectedConversation) return;
        fetchMessages(selectedConversation.id, 1, false).then(() => {
            // Scroll to bottom on initial load
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }), 100);
        });
    }, [selectedConversation]);

    // ----------------- Infinite Scroll (Lazy Load Older) -----------------
    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (!container || !selectedConversation) return;

        if (container.scrollTop === 0 && hasMore[selectedConversation.id]) {
            const nextPage = (pageTracker[selectedConversation.id] || 1) + 1;

            const prevHeight = container.scrollHeight;

            fetchMessages(selectedConversation.id, nextPage, true).then(() => {
                // Keep scroll at same position after new messages prepend
                const newHeight = container.scrollHeight;
                container.scrollTop = newHeight - prevHeight;
            });
        }
    };

    // ----------------- Send Message -----------------
    const sendMessage = async () => {
        if (!messageInput.trim() || !selectedConversation || !connectionRef.current) return;

        const newMessage = {
            conversationId: selectedConversation.id,
            content: messageInput
        };

        try {
            await connectionRef.current.invoke("SendMessage", newMessage);
            setMessageInput("");
            // Scroll to bottom after sending
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        } catch (err) {
            console.error("Failed to send message via SignalR:", err);
        }
    };

    // ----------------- Utilities -----------------
    const formatMessageTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formatTime = (date) => new Date(date).toLocaleDateString();
    const getConversationName = (conv) => conv.isGroup ? conv.name : conv.members[0]?.name || 'Unknown';
    const getConversationAvatar = (conv) => conv.isGroup ? <Users className="w-6 h-6" /> : <span>{conv.members[0]?.avatar || '👤'}</span>;
    const getOnlineStatus = (conv) => conv.isGroup ? `${conv.members.filter(m => m.isOnline).length} online` : conv.members[0]?.isOnline ? 'Online' : 'Offline';

    const filteredConversations = conversations.filter(conv =>
        getConversationName(conv).toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ----------------- JSX Render -----------------
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                            😊
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">{myAuth?.name || "You"}</h2>
                            <p className="text-xs text-gray-500">Available</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Settings className="w-5 h-5 text-gray-600" />
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-3 p-4">
                    <Search className="absolute left-6 top-3 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.map(conv => (
                        <div key={conv.id} onClick={() => setSelectedConversation(conv)}
                            className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedConversation?.id === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white">
                                    {getConversationAvatar(conv)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between">
                                        <h3 className="font-semibold truncate">{getConversationName(conv)}</h3>
                                        <span className="text-xs text-gray-500">{formatTime(conv.lastMessage?.sentAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage?.content}</p>
                                        {conv.unreadCount > 0 && <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">{conv.unreadCount}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white">
                                    {getConversationAvatar(selectedConversation)}
                                </div>
                                <div>
                                    <h2 className="font-semibold">{getConversationName(selectedConversation)}</h2>
                                    <p className="text-xs text-gray-500">{getOnlineStatus(selectedConversation)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-gray-600" />
                                <Video className="w-5 h-5 text-gray-600" />
                                <MoreVertical className="w-5 h-5 text-gray-600" />
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={messagesContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto p-4 flex flex-col gap-2"
                        >
                            {(messages[selectedConversation.id] || []).map(msg => {
                                const isMine = msg.senderId?.toString() === currentUserId?.toString();
                                return (
                                    <div key={msg.id} className={`flex gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
                                        {!isMine && (
                                            <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white text-sm">
                                                {msg.senderAvatar || '👤'}
                                            </div>
                                        )}
                                        <div className={`max-w-xs p-2 rounded-lg ${isMine ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
                                            <p className="text-sm">{msg.content}</p>
                                            <div className="flex justify-end gap-1 text-xs mt-1">
                                                {msg.reactions?.map(r => <span key={r.userId}>{r.reaction}</span>)}
                                                <span>{formatMessageTime(msg.sentAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef}></div>
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-200 flex gap-2 items-center">
                            <Paperclip className="w-5 h-5 text-gray-500 cursor-pointer" />
                            <Smile className="w-5 h-5 text-gray-500 cursor-pointer" />
                            <input
                                type="text"
                                placeholder="Type a message"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                            />
                            <button onClick={sendMessage} className="p-2 bg-blue-500 rounded-full text-white">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 text-xl">Select a conversation</div>
                )}
            </div>
        </div>
    );
};

export default ChatPageDemo;
