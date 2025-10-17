import React, { useState } from "react";
import anonymous from "../../assets/anonymous.png";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { useChat } from "../../Contexts/ChatContext";

const AddMemberModal = ({ currentMembers = [], onClose, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const friends = useSelector((state) => state.friend.friends || []);
  const { addToConversation, selectedConversation } = useChat();
  // Handle adding a single friend
  const handleAddFriend = async (friendId) => {
    try {
      await addToConversation(selectedConversation.id, friendId);
    } catch (err) {
      console.error("Failed to add friend:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-[400px] p-4 relative shadow-lg">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-semibold mb-3">Add Members to Group</h3>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 mb-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Friend list */}
        <div className="max-h-56 overflow-y-auto mb-3 rounded-md border border-gray-200">
          {friends.length > 0 ? (
            friends
              .filter((f) =>
                `${f.friend.firstName} ${f.friend.lastName}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((friend) => {
                const isAlreadyAdded = currentMembers.some(
                  (m) => m.user.id === friend.friend.id
                );

                return (
                  <div
                    key={friend.friend.id}
                    className={`flex items-center justify-between gap-3 p-2 rounded-md transition ${
                      isAlreadyAdded
                        ? "bg-gray-100 cursor-not-allowed opacity-60"
                        : "hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={friend.friend.avatarUrl || anonymous}
                        alt="avatar"
                        className="w-9 h-9 rounded-full border"
                      />
                      <span className="text-sm font-medium">
                        {friend.friend.firstName} {friend.friend.lastName}
                      </span>
                    </div>

                    {/* Add button or Already Added */}
                    {isAlreadyAdded ? (
                      <span className="text-xs text-green-600 font-semibold">
                        Added
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddFriend(friend.friend.id)}
                        className="text-xs text-blue-600 font-semibold px-2 py-1 border border-blue-600 rounded hover:bg-blue-50 transition"
                      >
                        Add
                      </button>
                    )}
                  </div>
                );
              })
          ) : (
            <p className="text-gray-400 text-sm p-2">No friends found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
