import React, { useEffect, useState, useMemo } from "react";
import ConversationList from "./ConversationList";
import anonymous from "../../assets/anonymous.png";
import { Settings, MoreVertical, Plus } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";
import { createConversationApi } from "../../Apis/ChatApi";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  myAuth,
  conversations,
  selectedConversation,
  setSelectedConversation,
  searchQuery,
  setSearchQuery,
  friends,
  setConversations,
}) => {
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const navigate = useNavigate();

  // ✅ useMemo to avoid recalculating filters on every render
  const filteredConversations = useMemo(() => {
    // Create virtual conversations for friends who aren't in any real conversation
    if( searchQuery == '' ) return conversations;
    const virtualConvs = (friends || [])
      .map((f) => {
        const friendUser = f.friend;
        if (!friendUser) return null;

        const exists = conversations.some(
          (conv) =>
            !conv.isGroup &&
            conv.members?.some((m) => (m.user?.id || m.id) === friendUser.id)
        );

        if (exists) return null;
        return {
          id: `friend-${friendUser.id}`,
          isGroup: false,
          isVirtual: true,
          pictureUrl: friendUser.avatarUrl || anonymous,
          name: `${friendUser.firstName || ""} ${
            friendUser.lastName || ""
          }`.trim(),
          members: [{ user: friendUser, role: "Member" }],
          lastMessage: null,
          unreadCount: 0,
        };
      })
      .filter(Boolean);
    // Merge real conversations + virtual friends
    const mergedConvs = [...conversations, ...virtualConvs];

    // Filter by search query
    return mergedConvs.filter((conv) =>
      conv.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, friends, searchQuery]);

  const filteredFriends = useMemo(() => {
    return (friends || []).filter((friend) =>
      `${friend.friend.firstName || ""} ${friend.friend.lastName || ""}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [friends, searchQuery]);

  const handleCreateGroup = async (newGroup) => {
    try {
      const res = await createConversationApi(newGroup);
      if (res?.data) {
        setConversations((prev) => [res.data, ...prev]);
        setSelectedConversation(res.data);
      }
      setShowCreateGroupModal(false);
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };
  return (
    <div className="w-1/5 border-r border-gray-200 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div
          onClick={() => navigate(`/profile/${myAuth.id}`)}
          className="flex items-center cursor-pointer p-2 rounded-md hover:bg-gray-200 duration-200"
        >
          <img
            src={myAuth?.avatarUrl || anonymous}
            alt="Me"
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="font-medium text-gray-800">
            {myAuth?.firstName} {myAuth?.lastName}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setShowCreateGroupModal(true)}
            className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
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

      {/* Conversation / Friends list */}
      <ConversationList
        conversations={filteredConversations}
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        searchQuery={searchQuery}
      />

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <CreateGroupModal
          friends={filteredFriends}
          onClose={() => setShowCreateGroupModal(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
};

export default Sidebar;
