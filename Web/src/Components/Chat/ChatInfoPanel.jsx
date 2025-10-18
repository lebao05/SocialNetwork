import React, { useState } from "react";
import {
  X,
  Bell,
  BellOff,
  Search,
  Image,
  File,
  Link,
  UserPlus,
} from "lucide-react";
import anonymous from "../../assets/anonymous.png";
import AddMemberModal from "./AddMemberModal";
import RenameGroupModal from "./RenameGroupModal";
import ChangeAliasModal from "./ChangeAliasModal";
import ChangeDefaultEmotionModal from "./ChangeDefaultEmotionModal";
const ChatInfoPanel = ({ conversation, onClose }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showsRenameModal, setShowsRenameModal] = useState(false);
  const [showChangeAliasModal, setShowChangeAliasModal] = useState(false);
  const [showEmotionModal, setShowEmotionModal] = useState(false);
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };
  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chat Details</h2>
        <X className="cursor-pointer" size={20} onClick={onClose} />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile */}
        <div className="p-6 text-center border-b border-gray-200">
          <img
            src={anonymous}
            alt={"Avatar"}
            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
          />
          <h3 className="font-semibold text-lg">{conversation.name}</h3>
          <p className="text-sm text-gray-500">Online</p>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-200 flex justify-around">
          <button className="flex flex-col items-center gap-2 hover:opacity-70">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Bell size={20} />
            </div>
            <span className="text-xs">Disable Notification</span>
          </button>
          <button className="flex flex-col items-center gap-2 hover:opacity-70">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Search size={20} />
            </div>
            <span className="text-xs">Search</span>
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-2">
          {/* Customize Chat */}
          <div className="border-b border-gray-200">
            <button
              className="w-full p-4 flex justify-between hover:bg-gray-50"
              onClick={() => toggleSection("customize")}
            >
              <span className="font-medium">🎨 Adjust Chat Info</span>
              <span>{activeSection === "customize" ? "▼" : "▶"}</span>
            </button>
            {activeSection === "customize" && (
              <div className="px-4 pb-4 space-y-2">
                <button
                  className="w-full text-left py-2 hover:bg-gray-50 rounded"
                  onClick={() => setShowsRenameModal(true)}
                >
                  ✏️ Change Name
                </button>
                <button className="w-full text-left py-2 hover:bg-gray-50 rounded">
                  🖼️ Change Image
                </button>
                <button className="w-full text-left py-2 hover:bg-gray-50 rounded">
                  💜 Change Theme
                </button>
                <button
                  onClick={() => setShowEmotionModal(true)}
                  className="w-full text-left py-2 hover:bg-gray-50 rounded"
                >
                  {conversation.defaultReaction} Change defaul reaction
                </button>
                <button
                  onClick={() => {
                    setShowChangeAliasModal(true);
                  }}
                  className="w-full text-left py-2 hover:bg-gray-50 rounded"
                >
                  Aa Change alias
                </button>
              </div>
            )}
          </div>

          {/* Members Section */}
          {conversation.isGroup && (
            <div className="border-b border-gray-200">
              <button
                className="w-full p-4 flex justify-between hover:bg-gray-50"
                onClick={() => toggleSection("members")}
              >
                <span className="font-medium">👥 Members</span>
                <span>{activeSection === "members" ? "▼" : "▶"}</span>
              </button>
              {activeSection === "members" && (
                <div className="px-4 pb-4 space-y-2">
                  {conversation.members.map((m) => (
                    <div
                      key={m.user.id}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={m.user.avatarUrl || anonymous}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium">
                            {m.user.firstName + " " + m.user.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {m.addedBy} added
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        ⋯
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="w-full cursor-pointer py-2 flex items-center justify-center gap-2 hover:bg-gray-50 rounded"
                  >
                    <UserPlus size={20} /> Add more people to group
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Media & Files */}
          <div className="border-b border-gray-200">
            <button
              className="w-full p-4 flex justify-between hover:bg-gray-50"
              onClick={() => toggleSection("media")}
            >
              <span className="font-medium">📁 Media,file and link</span>
              <span>{activeSection === "media" ? "▼" : "▶"}</span>
            </button>
            {activeSection === "media" && (
              <div className="px-4 pb-4 space-y-2">
                <button className="w-full text-left py-2 hover:bg-gray-50 rounded flex items-center gap-2">
                  <Image size={18} /> Media
                </button>
                <button className="w-full text-left py-2 hover:bg-gray-50 rounded flex items-center gap-2">
                  <File size={18} /> File
                </button>
                <button className="w-full text-left py-2 hover:bg-gray-50 rounded flex items-center gap-2">
                  <Link size={18} /> Link
                </button>
              </div>
            )}
          </div>

          {/* Privacy & Support */}
          <div className="border-b border-gray-200">
            <button
              className="w-full p-4 flex justify-between hover:bg-gray-50"
              onClick={() => toggleSection("privacy")}
            >
              <span className="font-medium">🔒 Private</span>
              <span>{activeSection === "privacy" ? "▼" : "▶"}</span>
            </button>
            {activeSection === "privacy" && (
              <div className="px-4 pb-4 space-y-2">
                <button className="w-full text-left py-2 hover:bg-gray-50 rounded flex items-center gap-2">
                  <BellOff size={18} /> Disable Notification
                </button>
                <button className="w-full text-left py-2 hover:bg-gray-50 rounded flex items-center gap-2">
                  👁️ Notification readed
                </button>
              </div>
            )}
          </div>

          {/* Leave Group */}
          {conversation.isGroup && (
            <div className="p-4">
              <button className="w-full py-3 text-red-600 hover:bg-red-50 rounded font-medium">
                Leave Group
              </button>
            </div>
          )}
        </div>
      </div>
      {showAddMemberModal && (
        <AddMemberModal
          currentMembers={conversation.members}
          onClose={() => setShowAddMemberModal(false)}
        />
      )}
      {showsRenameModal && (
        <RenameGroupModal
          conversation={conversation}
          onClose={() => setShowsRenameModal(false)}
        />
      )}
      {showChangeAliasModal && (
        <ChangeAliasModal
          members={conversation.members}
          onClose={() => setShowChangeAliasModal(false)}
        />
      )}
      {showEmotionModal && (
        <ChangeDefaultEmotionModal
          conversation={conversation}
          onClose={() => setShowEmotionModal(false)}
        />
      )}
    </div>
  );
};

export default ChatInfoPanel;
