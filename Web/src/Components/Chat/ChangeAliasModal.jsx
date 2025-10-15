import React, { useState } from "react";
import { X, Check, Pencil } from "lucide-react";
import anonymous from "../../assets/anonymous.png";

const ChangeAliasModal = ({ members = [], onClose, onSaveAlias }) => {
  const [editingId, setEditingId] = useState(null);
  const [nicknames, setNicknames] = useState(
    members.reduce((acc, m) => {
      acc[m.id] = m.nickname || "";
      return acc;
    }, {})
  );

  // Handle alias input change
  const handleNicknameChange = (id, value) => {
    setNicknames((prev) => ({ ...prev, [id]: value }));
  };

  // Save alias for one member at a time
  const handleSaveAlias = (id) => {
    const alias = nicknames[id].trim();
    onSaveAlias(id, alias); // send alias for this member only
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#242526] text-white w-[420px] rounded-xl p-5 relative shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-[#3a3b3c]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold text-center mb-4">Alias</h2>

        {/* Members list */}
        <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-3 bg-[#3a3b3c]/50 rounded-lg p-2"
            >
              <div className="flex items-center gap-3">
                <img
                  src={member.user.avatarUrl || anonymous}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border border-[#3a3b3c]"
                />
                <div>
                  <p className="font-medium text-sm">
                    {member.firstName} {member.lastName}
                  </p>

                  {editingId === member.id ? (
                    <input
                      type="text"
                      value={nicknames[member.id]}
                      onChange={(e) =>
                        handleNicknameChange(member.id, e.target.value)
                      }
                      placeholder="Enter alias..."
                      className="bg-transparent border border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md px-2 py-1 text-sm outline-none w-[180px]"
                    />
                  ) : (
                    <p className="text-gray-400 text-xs">
                      {nicknames[member.id]
                        ? `Alias: ${nicknames[member.id]}`
                        : "Give an alias"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {editingId === member.id ? (
                  <Check
                    className="w-4 h-4 cursor-pointer text-blue-500 hover:text-blue-400"
                    onClick={() => handleSaveAlias(member.id)}
                  />
                ) : (
                  <Pencil
                    className="w-4 h-4 cursor-pointer text-gray-400 hover:text-white"
                    onClick={() => setEditingId(member.id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChangeAliasModal;
