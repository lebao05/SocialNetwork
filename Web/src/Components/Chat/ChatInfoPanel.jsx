import React, { useEffect, useState } from "react";
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
import { CgProfile } from "react-icons/cg";
import { RiChatPrivateLine } from "react-icons/ri";
import { CiFolderOn, CiImageOn, CiBellOn } from "react-icons/ci";
import { FaPencil } from "react-icons/fa6";
import {
  FaComment,
  FaUser,
  FaBan,
  FaPhone,
  FaVideo,
  FaUserFriends,
} from "react-icons/fa";

import { MdBlock, MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa";
import YesNoModal from "./YesNoModal";
import anonymous from "../../assets/anonymous.png";
import AddMemberModal from "./AddMemberModal";
import RenameGroupModal from "./RenameGroupModal";
import ChangeAliasModal from "./ChangeAliasModal";
import ChangeDefaultEmotionModal from "./ChangeDefaultEmotionModal";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { useChat } from "../../Contexts/ChatContext";
import { useSelector } from "react-redux";
import { set } from "date-fns";
import { useNavigate } from "react-router-dom";
const ChatInfoPanel = ({ conversation, onClose }) => {
  const navigate = useNavigate();
  const myAuth = useSelector((state) => state.auth.user);
  const [activeSection, setActiveSection] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showsRenameModal, setShowsRenameModal] = useState(false);
  const [showChangeAliasModal, setShowChangeAliasModal] = useState(false);
  const [showEmotionModal, setShowEmotionModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const isNotificationEnabled = conversation.notificationEnabled;
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };
  const [memberBlocked, setMemberBlocked] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    member: null,
  });
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenu.visible) {
        const menu = document.getElementById("context-menu");
        if (menu && !menu.contains(e.target)) {
          setContextMenu({ visible: false, x: 0, y: 0, member: null });
        }
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [contextMenu.visible]);
  const {
    leaveConversation,
    handleBlockUser,
    blockedUsers,
    enableNotification,
  } = useChat();
  return (
    <div className="w-96 bg-white border-l pr-3 border-gray-200 flex flex-col h-full overflow-hidden">
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
          {conversation.isGroup === false && (
            <button className="flex flex-col cursor-pointer items-center gap-2 hover:opacity-70">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <CgProfile size={20} />
              </div>
              <span className="text-xs">Profile</span>
            </button>
          )}
          <button className="flex flex-col cursor-pointer items-center gap-2 hover:opacity-70">
            <div
              onClick={() => enableNotification(conversation.id)}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
            >
              {isNotificationEnabled ? (
                <BellOff size={20} />
              ) : (
                <Bell size={20} />
              )}
            </div>
            <span className="text-xs">
              {isNotificationEnabled ? "Disable" : "Enable"} Notification
            </span>
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
              <span className="flex items-center gap-1 font-medium">
                <HiOutlineAdjustmentsHorizontal /> Infos
              </span>
              <span>{activeSection === "customize" ? "▼" : "▶"}</span>
            </button>
            {activeSection === "customize" && (
              <div className="px-4 pb-4 space-y-2">
                <button
                  className="w-full flex items-center gap-2 text-left py-2 px-2 hover:bg-gray-50 rounded transition"
                  onClick={() => setShowsRenameModal(true)}
                >
                  <FaPencil className="text-gray-600" />
                  <span className="font-medium text-gray-700">Change Name</span>
                </button>

                <button className="w-full flex items-center gap-2 text-left py-2 px-2 hover:bg-gray-50 rounded transition">
                  <CiImageOn /> Change Image
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
                <span className="flex items-center gap-1 font-medium">
                  <FaUserFriends /> Members
                </span>
                <span>{activeSection === "members" ? "▼" : "▶"}</span>
              </button>
              {activeSection === "members" && (
                <div className="px-2 pb-4 space-y-2">
                  {conversation.members.map((m, idx) => (
                    <div
                      key={idx}
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
                      <button
                        className="text-gray-400 text-2xl font-bold cursor-pointer flex align-middle hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setContextMenu({
                            visible: true,
                            x: rect.left,
                            y: rect.bottom,
                            member: m,
                          });
                        }}
                      >
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
              <span className="flex items-center gap-1 font-medium">
                <CiFolderOn />
                Media,file and link
              </span>
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
              <button className="flex items-center gap-1 font-medium">
                <RiChatPrivateLine />
                Private
              </button>

              <span>{activeSection === "privacy" ? "▼" : "▶"}</span>
            </button>
            {activeSection === "privacy" && (
              <div className="px-4 pb-4 space-y-2">
                <button
                  onClick={() => enableNotification(conversation.id)}
                  className="cursor-pointer w-full text-left py-2 hover:bg-gray-50 rounded flex items-center gap-2"
                >
                  {!isNotificationEnabled ? (
                    <>
                      <CiBellOn size={18} />
                      Enable Notification
                    </>
                  ) : (
                    <>
                      <BellOff size={18} /> Disable Notification
                    </>
                  )}
                </button>
                <button className="w-full text-left py-2 hover:bg-gray-50 rounded flex items-center gap-2">
                  <MdOutlineRemoveRedEye /> Notification readed
                </button>
                {conversation.isGroup === false && (
                  <button
                    onClick={() => {
                      setMemberBlocked(
                        conversation.members.find(
                          (m) => m.user.id !== myAuth.id
                        )
                      );
                      setShowBlockModal(true);
                    }} // 🆕 Trigger modal
                    className="w-full cursor-pointer text-left py-2 hover:bg-gray-50 rounded flex items-center gap-2"
                  >
                    <MdBlock size={18} />{" "}
                    {conversation.members.find((m) =>
                      blockedUsers.includes(m.user.id)
                    )
                      ? "Unlock "
                      : "Block "}
                    User
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Leave Group */}
          {conversation.isGroup && (
            <div
              className="p-4"
              onClick={() => leaveConversation(conversation.id)}
            >
              <button className="w-full py-3 text-red-600 hover:bg-red-50 rounded font-medium">
                Leave Group
              </button>
            </div>
          )}
        </div>
      </div>
      {contextMenu.visible && (
        <div
          id="context-menu"
          className="fixed z-50 bg-white text-black rounded-xl shadow-lg w-56 py-1 text-sm font-medium"
          style={{
            top: contextMenu.y,
            left: Math.min(contextMenu.x, window.innerWidth - 250),
          }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 rounded">
            <FaComment size={16} />
            Send Message
          </button>
          <button
            onClick={() => {
              navigate(`/profile/${contextMenu.member.user.id}`);
              setContextMenu({ visible: false, x: 0, y: 0, member: null });
            }}
            className="w-full cursor-pointer text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 rounded"
          >
            <FaUser size={16} />
            View Profile
          </button>
          <button
            className="w-full cursor-pointer text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 rounded"
            onClick={() => {
              setMemberBlocked(contextMenu.member);
              setShowBlockModal(true);
              setContextMenu({
                visible: false,
                x: 0,
                y: 0,
                member: contextMenu.member,
              });
            }}
          >
            {blockedUsers.includes(contextMenu.member.user.id) ? (
              <>
                <FaRegEyeSlash size={16} />
                Unblock
              </>
            ) : (
              <>
                <FaBan size={16} />
                Block
              </>
            )}
          </button>
          <hr className="border-gray-200 my-1" />
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 rounded">
            <FaPhone size={16} />
            Voice Call
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 rounded">
            <FaVideo size={16} />
            Video Call
          </button>
        </div>
      )}

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
      {showBlockModal && (
        <YesNoModal
          title="Block Messages"
          message="Are you sure you want to block messages from this user?"
          onCancel={() => setShowBlockModal(false)}
          onConfirm={async () => {
            // perform your block logic here
            console.log("Blocking user:", memberBlocked);
            await handleBlockUser(memberBlocked.user.id);
            setShowBlockModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatInfoPanel;
