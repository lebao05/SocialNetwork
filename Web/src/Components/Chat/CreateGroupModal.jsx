import React, { useState, useMemo } from "react";
import anonymous from "../../assets/anonymous.png";
import { X } from "lucide-react";

const CreateGroupModal = ({ friends, onClose, onCreate }) => {
    const [groupName, setGroupName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [error, setError] = useState(""); 
    const [searchTerm, setSearchTerm] = useState(""); // <-- Add search term state

    const toggleMember = (friend) => {
        setSelectedMembers(prev => {
            if (prev.some(m => m.id === friend.friend.id)) {
                return prev.filter(m => m.id !== friend.friend.id);
            }
            return [...prev, friend.friend];
        });
        setError("");
    };

    const handleCreate = async () => {
        if (!groupName.trim() && selectedMembers.length === 0) {
            setError("Please enter a group name and select at least one member.");
            return;
        }
        if (!groupName.trim()) {
            setError("Please enter a group name.");
            return;
        }
        if (selectedMembers.length === 0) {
            setError("Please select at least one member.");
            return;
        }

        const memberIds = selectedMembers.map(f => f.id);
        const newGroup = {
            name: groupName,
            isGroup: true,
            memberIds
        };
        await onCreate(newGroup);

        // Reset
        setGroupName("");
        setSelectedMembers([]);
        setError("");
        setSearchTerm("");
    };

    // Filter friends based on search term
    const filteredFriends = useMemo(() => {
        return friends.filter(f =>
            `${f.friend.firstName} ${f.friend.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [friends, searchTerm]);

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-100 p-4 relative">
                <button
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
                    onClick={onClose}
                >
                    <X className="w-4 h-4" />
                </button>
                <h3 className="text-lg font-medium mb-3">Create Group</h3>

                <input
                    type="text"
                    placeholder="Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-3 py-2 mb-1 rounded-md border border-gray-300"
                />

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <h4 className="font-medium mb-1">Select Members</h4>
                <input
                    type="text"
                    placeholder="Search friends..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-1 mb-2 rounded-md border border-gray-300"
                />

                <div className="max-h-48 overflow-y-auto mb-3 rounded-md p-2 border border-gray-200">
                    {filteredFriends.length > 0 ? (
                        filteredFriends.map(friend => (
                            <div
                                key={friend.friend.id}
                                onClick={() => toggleMember(friend)}
                                className={`flex items-center gap-2 p-2 cursor-pointer rounded ${
                                    selectedMembers.some(m => m.id === friend.friend.id) ? "bg-blue-100" : ""
                                }`}
                            >
                                <img
                                    src={friend.friend.avatarUrl || anonymous}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full"
                                />
                                <span>{friend.friend.firstName} {friend.friend.lastName}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm">No friends found.</p>
                    )}
                </div>

                <button
                    onClick={handleCreate}
                    className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default CreateGroupModal;
