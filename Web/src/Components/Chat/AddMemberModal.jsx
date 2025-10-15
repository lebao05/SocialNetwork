import React, { useState, useMemo } from "react";
import anonymous from "../../assets/anonymous.png";
import { X } from "lucide-react";
import { useSelector } from "react-redux";

const AddMemberModal = ({ currentMembers = [], onClose, onAdd }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const friends = useSelector((state) => state.friend.friends || []);

  // Toggle member selection
  const toggleMember = (friend) => {
    setSelectedMembers((prev) => {
      if (prev.some((m) => m.id === friend.friend.id)) {
        return prev.filter((m) => m.id !== friend.friend.id);
      }
      return [...prev, friend.friend];
    });
    setError("");
  };

  // Handle add members
  const handleAdd = async () => {
    if (selectedMembers.length === 0) {
      setError("Please select at least one member.");
      return;
    }

    const memberIds = selectedMembers.map((f) => f.id);
    await onAdd(memberIds);

    // Reset and close
    setSelectedMembers([]);
    setError("");
    setSearchTerm("");
    onClose();
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

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

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
                const isSelected = selectedMembers.some(
                  (m) => m.id === friend.friend.id
                );

                return (
                  <div
                    key={friend.friend.id}
                    onClick={() => !isAlreadyAdded && toggleMember(friend)}
                    className={`flex items-center justify-between gap-3 p-2 rounded-md cursor-pointer transition ${
                      isAlreadyAdded
                        ? "bg-gray-100 cursor-not-allowed opacity-60"
                        : isSelected
                        ? "bg-blue-100"
                        : "hover:bg-gray-50"
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

                    {/* Status label */}
                    {isAlreadyAdded && (
                      <span className="text-xs text-green-600 font-semibold">
                        Added
                      </span>
                    )}
                    {isSelected && !isAlreadyAdded && (
                      <span className="text-xs text-blue-600 font-semibold">
                        Selected
                      </span>
                    )}
                  </div>
                );
              })
          ) : (
            <p className="text-gray-400 text-sm p-2">No friends found.</p>
          )}
        </div>

        {/* Add button */}
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Members
        </button>
      </div>
    </div>
  );
};

export default AddMemberModal;
