import React from "react";
import ConversationList from "./ConversationList";
import anonymous from "../../assets/anonymous.png"
const Sidebar = ({
    myAuth,
    conversations,
    selectedConversation,
    setSelectedConversation,
    searchQuery,
    setSearchQuery,
    friends,
}) => {
    // Filtered conversations
    const filteredConversations = conversations.filter(conv =>
        (conv.isGroup ? conv.name : conv.members[0]?.name || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );
    // Filtered friends
    const filteredFriends = (friends || []).filter(friend =>
        `${friend.friend.firstName || ""} ${friend.friend.lastName || ""}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );
    return (
        <div className="w-1/4 border-r border-gray-200 flex flex-col bg-white">
            {/* Current user info */}
            <div className="p-4 border-b border-gray-200 flex items-center">
                <img
                    src={myAuth?.avatarUrl || anonymous}
                    alt="Me"
                    className="w-10 h-10 rounded-full mr-3"
                />
                <span className="font-medium">{myAuth?.firstName} {myAuth?.lastName}</span>
            </div>

            {/* Search bar */}
            <div className="p-2">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border text-sm"
                />
            </div>

            {/* If searching → show friends */}
            {searchQuery ? (
                <div className="flex-1 overflow-y-auto">
                    <h4 className="px-4 py-2 text-gray-500 text-xs uppercase">Friends</h4>
                    {filteredFriends.map(friend => (
                        <div
                            key={friend.friend.id}
                            onClick={() => {
                                setSelectedConversation({
                                    id: `friend-${friend.friend.id}`, // purely UI
                                    isGroup: false,
                                    isVirtual: true, // mark this is not from backend
                                    name: `${friend.friend.firstName} ${friend.friend.lastName}`,
                                    members: [
                                        {
                                            id: friend.friend.id,
                                            firstName: friend.friend.firstName,
                                            lastName: friend.friend.lastName,
                                            avatarUrl: friend.friend.avatarUrl,
                                        },
                                    ],
                                    lastMessage: null,
                                    unreadCount: 0,
                                });
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                        >
                            <img
                                src={friend.friend.avatarUrl || "/default-avatar.png"}
                                alt="avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <span className="font-medium">
                                {friend.friend.firstName} {friend.friend.lastName}
                            </span>
                        </div>
                    ))}

                </div>
            ) : (
                <ConversationList
                    conversations={filteredConversations}
                    selectedConversation={selectedConversation}
                    setSelectedConversation={setSelectedConversation}
                    searchQuery={searchQuery}
                />
            )
            }
        </div >
    );
};

export default Sidebar;
