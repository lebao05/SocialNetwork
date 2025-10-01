import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Users, Phone, Video, MoreVertical, Search, Paperclip, Smile, Image, Mic, X, Check, CheckCheck, Plus, UserPlus, Settings, LogOut } from 'lucide-react';

const ChatPage = () => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showNewChat, setShowNewChat] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);

    // Mock data
    const currentUser = {
        id: 'me',
        name: 'You',
        avatar: '😊',
        status: 'Available'
    };

    const [conversations, setConversations] = useState([
        {
            id: '1',
            name: null,
            isGroup: false,
            members: [
                { userId: '2', name: 'Sarah Johnson', avatar: '👩', isOnline: true, lastSeen: null }
            ],
            lastMessage: {
                content: 'Hey! How are you doing?',
                sentAt: new Date(Date.now() - 300000),
                senderName: 'Sarah Johnson',
                senderId: '2'
            },
            unreadCount: 3
        },
        {
            id: '2',
            name: 'Design Team',
            isGroup: true,
            members: [
                { userId: '3', name: 'Mike Chen', avatar: '👨', isOnline: true },
                { userId: '4', name: 'Emma Davis', avatar: '👩', isOnline: false },
                { userId: '5', name: 'Alex Kim', avatar: '🧑', isOnline: true }
            ],
            lastMessage: {
                content: 'The new mockups are ready for review',
                sentAt: new Date(Date.now() - 3600000),
                senderName: 'Mike Chen',
                senderId: '3'
            },
            unreadCount: 0
        },
        {
            id: '3',
            name: null,
            isGroup: false,
            members: [
                { userId: '6', name: 'James Wilson', avatar: '👨‍💼', isOnline: false, lastSeen: new Date(Date.now() - 7200000) }
            ],
            lastMessage: {
                content: 'Thanks for the update!',
                sentAt: new Date(Date.now() - 86400000),
                senderName: 'You',
                senderId: 'me'
            },
            unreadCount: 0
        },
        {
            id: '4',
            name: 'Family Group',
            isGroup: true,
            members: [
                { userId: '7', name: 'Mom', avatar: '👩‍🦳', isOnline: true },
                { userId: '8', name: 'Dad', avatar: '👨‍🦳', isOnline: false },
                { userId: '9', name: 'Sister', avatar: '👧', isOnline: true }
            ],
            lastMessage: {
                content: "Don't forget dinner tonight!",
                sentAt: new Date(Date.now() - 10800000),
                senderName: 'Mom',
                senderId: '7'
            },
            unreadCount: 1
        }
    ]);

    const [messages, setMessages] = useState({
        '1': [
            {
                id: 'm1',
                senderId: '2',
                senderName: 'Sarah Johnson',
                senderAvatar: '👩',
                content: 'Hey! How are you doing?',
                sentAt: new Date(Date.now() - 300000),
                reactions: [],
                readBy: ['me']
            },
            {
                id: 'm2',
                senderId: 'me',
                senderName: 'You',
                senderAvatar: '😊',
                content: "I'm great! Just finished the project.",
                sentAt: new Date(Date.now() - 240000),
                reactions: [{ userId: '2', reaction: '👍' }],
                readBy: ['2']
            },
            {
                id: 'm3',
                senderId: '2',
                senderName: 'Sarah Johnson',
                senderAvatar: '👩',
                content: 'Awesome! Want to grab coffee later?',
                sentAt: new Date(Date.now() - 180000),
                reactions: [],
                readBy: []
            },
            {
                id: 'm4',
                senderId: 'me',
                senderName: 'You',
                senderAvatar: '😊',
                content: 'Sure! How about 4 PM at the usual place?',
                sentAt: new Date(Date.now() - 120000),
                reactions: [],
                readBy: []
            },
            {
                id: 'm5',
                senderId: '2',
                senderName: 'Sarah Johnson',
                senderAvatar: '👩',
                content: 'Perfect! See you then 😊',
                sentAt: new Date(Date.now() - 60000),
                reactions: [],
                readBy: []
            }
        ],
        '2': [
            {
                id: 'm6',
                senderId: '3',
                senderName: 'Mike Chen',
                senderAvatar: '👨',
                content: 'The new mockups are ready for review',
                sentAt: new Date(Date.now() - 3600000),
                reactions: [{ userId: '4', reaction: '❤️' }, { userId: 'me', reaction: '🎉' }],
                readBy: ['me', '4', '5']
            },
            {
                id: 'm7',
                senderId: 'me',
                senderName: 'You',
                senderAvatar: '😊',
                content: 'Looks amazing! Great work team!',
                sentAt: new Date(Date.now() - 3000000),
                reactions: [],
                readBy: ['3', '5']
            }
        ]
    });

    const [typingUsers, setTypingUsers] = useState({});

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedConversation]);

    const sendMessage = () => {
        if (!messageInput.trim() || !selectedConversation) return;

        const newMessage = {
            id: `m${Date.now()}`,
            senderId: 'me',
            senderName: 'You',
            senderAvatar: '😊',
            content: messageInput,
            sentAt: new Date(),
            reactions: [],
            readBy: []
        };

        setMessages(prev => ({
            ...prev,
            [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage]
        }));

        setConversations(prev => prev.map(conv =>
            conv.id === selectedConversation.id
                ? { ...conv, lastMessage: { content: messageInput, sentAt: new Date(), senderName: 'You', senderId: 'me' }, unreadCount: 0 }
                : conv
        ));

        setMessageInput('');
    };

    const addReaction = (messageId, emoji) => {
        setMessages(prev => {
            const newMessages = { ...prev };
            Object.keys(newMessages).forEach(convId => {
                newMessages[convId] = newMessages[convId].map(msg =>
                    msg.id === messageId
                        ? {
                            ...msg,
                            reactions: [...msg.reactions.filter(r => r.userId !== 'me'), { userId: 'me', reaction: emoji }]
                        }
                        : msg
                );
            });
            return newMessages;
        });
    };

    const formatTime = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (hours < 48) return 'Yesterday';
        return new Date(date).toLocaleDateString();
    };

    const formatMessageTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const getConversationName = (conv) => {
        if (conv.isGroup) return conv.name;
        return conv.members[0]?.name || 'Unknown';
    };

    const getConversationAvatar = (conv) => {
        if (conv.isGroup) {
            return (
                <div className="relative w-12 h-12">
                    <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                        {conv.members[0]?.avatar || '👤'}
                    </div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm border-2 border-white">
                        {conv.members[1]?.avatar || '👤'}
                    </div>
                </div>
            );
        }
        return <span className="text-2xl">{conv.members[0]?.avatar || '👤'}</span>;
    };

    const getOnlineStatus = (conv) => {
        if (conv.isGroup) {
            const onlineCount = conv.members.filter(m => m.isOnline).length;
            return `${onlineCount} online`;
        }
        const member = conv.members[0];
        if (member?.isOnline) return 'Online';
        if (member?.lastSeen) return `Last seen ${formatTime(member.lastSeen)}`;
        return 'Offline';
    };

    const filteredConversations = conversations.filter(conv =>
        getConversationName(conv).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                                {currentUser.avatar}
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900">{currentUser.name}</h2>
                                <p className="text-xs text-gray-500">{currentUser.status}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <Settings className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    <button
                        onClick={() => setShowNewChat(true)}
                        className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        New Chat
                    </button>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => {
                                setSelectedConversation(conv);
                                setConversations(prev => prev.map(c =>
                                    c.id === conv.id ? { ...c, unreadCount: 0 } : c
                                ));
                            }}
                            className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors ${selectedConversation?.id === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="relative flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white">
                                        {getConversationAvatar(conv)}
                                    </div>
                                    {!conv.isGroup && conv.members[0]?.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {getConversationName(conv)}
                                        </h3>
                                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                            {formatTime(conv.lastMessage?.sentAt)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600 truncate flex items-center gap-1">
                                            {conv.lastMessage?.senderId === 'me' && (
                                                <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                            )}
                                            {conv.lastMessage?.content || 'No messages yet'}
                                        </p>
                                        {conv.unreadCount > 0 && (
                                            <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-medium flex-shrink-0">
                                                {conv.unreadCount}
                                            </span>
                                        )}
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
                        <div className="bg-white border-b border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white">
                                        {getConversationAvatar(selectedConversation)}
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-gray-900 text-lg">
                                            {getConversationName(selectedConversation)}
                                        </h2>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            {getOnlineStatus(selectedConversation)}
                                            {typingUsers[selectedConversation.id] && (
                                                <span className="text-blue-500 animate-pulse">• typing...</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
                                        <Search className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
                                        <Phone className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
                                        <Video className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
                                        <MoreVertical className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                            {(messages[selectedConversation.id] || []).map((msg, idx, arr) => {
                                const isMe = msg.senderId === 'me';
                                const showAvatar = idx === 0 || arr[idx - 1].senderId !== msg.senderId;
                                const showName = !isMe && showAvatar && selectedConversation.isGroup;

                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                                        <div className={`flex gap-2 max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                            {!isMe && (
                                                <div className="flex-shrink-0">
                                                    {showAvatar ? (
                                                        <span className="text-2xl">{msg.senderAvatar}</span>
                                                    ) : (
                                                        <div className="w-8"></div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                {showName && (
                                                    <p className="text-xs text-gray-500 mb-1 ml-2 font-medium">{msg.senderName}</p>
                                                )}
                                                <div className="relative">
                                                    <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${isMe
                                                            ? 'bg-blue-500 text-white rounded-br-md'
                                                            : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                                                        }`}>
                                                        <p className="break-words leading-relaxed">{msg.content}</p>
                                                    </div>

                                                    {/* Reactions */}
                                                    {msg.reactions && msg.reactions.length > 0 && (
                                                        <div className={`flex gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                            {msg.reactions.map((r, idx) => (
                                                                <span key={idx} className="text-sm bg-white rounded-full px-2 py-0.5 shadow-sm border border-gray-200">
                                                                    {r.reaction}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Quick Reactions */}
                                                    <div className={`absolute top-0 ${isMe ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                                        <div className="flex gap-1 bg-white rounded-lg shadow-lg p-1 mx-2">
                                                            {reactions.slice(0, 3).map(emoji => (
                                                                <button
                                                                    key={emoji}
                                                                    onClick={() => addReaction(msg.id, emoji)}
                                                                    className="hover:scale-125 transition-transform text-lg p-1 hover:bg-gray-100 rounded"
                                                                >
                                                                    {emoji}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <span>{formatMessageTime(msg.sentAt)}</span>
                                                    {isMe && (
                                                        msg.readBy && msg.readBy.length > 0 ? (
                                                            <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                                        ) : (
                                                            <Check className="w-3.5 h-3.5 text-gray-400" />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="bg-white border-t border-gray-200 p-4">
                            <div className="flex items-end gap-2">
                                <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                                    <Paperclip className="w-5 h-5 text-gray-600" />
                                </button>
                                <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                                    <Image className="w-5 h-5 text-gray-600" />
                                </button>
                                <div className="flex-1 relative">
                                    <textarea
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                sendMessage();
                                            }
                                        }}
                                        placeholder="Type a message..."
                                        rows="1"
                                        className="w-full px-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32"
                                        style={{ minHeight: '44px' }}
                                    />
                                </div>
                                <button
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="p-2.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                                >
                                    <Smile className="w-5 h-5 text-gray-600" />
                                </button>
                                <button
                                    onClick={sendMessage}
                                    disabled={!messageInput.trim()}
                                    className={`p-2.5 rounded-full transition-colors flex-shrink-0 ${messageInput.trim()
                                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <MessageCircle className="w-12 h-12 text-white" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to Chat</h3>
                            <p className="text-gray-500">Select a conversation to start messaging</p>
                        </div>
                    </div>
                )}
            </div>

            {/* New Chat Modal */}
            {showNewChat && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">New Chat</h3>
                            <button
                                onClick={() => setShowNewChat(false)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        />
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {['Alice Cooper', 'Bob Smith', 'Charlie Brown'].map((name, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white">
                                        {name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{name}</p>
                                        <p className="text-sm text-gray-500">Online</p>
                                    </div>
                                    <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors">
                                        <UserPlus className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPage;