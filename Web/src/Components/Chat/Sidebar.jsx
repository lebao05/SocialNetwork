import React, { useState } from "react";
import ConversationList from "./ConversationList";
import anonymous from "../../assets/anonymous.png";
import { Settings, MoreVertical, Plus } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal"; // import new component
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
  const filteredConversations = conversations.filter((conv) =>
    (conv.isGroup ? conv.name : conv.members[0]?.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredFriends = (friends || []).filter((friend) =>
    `${friend.friend.firstName || ""} ${friend.friend.lastName || ""}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleCreateGroup = async (newGroup) => {
    try {
      const res = await createConversationApi(newGroup);
      if (res?.data) {
        setConversations((prev) => [res.data, ...prev]);
        setSelectedConversation(res.data);
      }
      setShowCreateGroupModal(false);
    } catch (err) {}
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
      <div></div>
      {/* Conversation / Friends list */}
      {searchQuery ? (
        <div className="flex-1 overflow-y-auto">
          <h4 className="px-4 py-2 text-gray-500 text-xs uppercase">Friends</h4>
          {filteredFriends.map((friend) => (
            <div
              key={friend.friend.id}
              onClick={() => {
                setSelectedConversation({
                  id: `friend-${friend.friend.id}`,
                  isGroup: false,
                  isVirtual: true,
                  pictureUrl: friend.friend?.avatarUrl,
                  name: `${friend.friend.firstName} ${friend.friend.lastName}`,
                  members: [friend.friend],
                  lastMessage: null,
                  unreadCount: 0,
                });
              }}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={friend.friend.avatarUrl || anonymous}
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
      )}

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <CreateGroupModal
          friends={friends}
          onClose={() => setShowCreateGroupModal(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
};

export default Sidebar;
