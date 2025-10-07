import React, { useState } from "react";
import { X, Bell, BellOff, Search, Image, File, Link, UserPlus } from "lucide-react";

const mockConversation = {
    id: 1,
    name: "Software engineer",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    isGroup: true,
    members: [
        { id: 1, name: "Gia Huy", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop", addedBy: "Gia Huy" },
        { id: 2, name: "Lê Bảo", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", addedBy: "Gia Huy" },
        { id: 3, name: "Ngọc Hiếu", avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop", addedBy: "Gia Huy" },
        { id: 4, name: "Phan Nhật Thiện Nhân", avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop", addedBy: "Gia Huy" },
        { id: 5, name: "Vũ Phan Anh", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", addedBy: "Gia Huy" }
    ]
};

const ChatInfoPanel = ({ conversation = mockConversation, onClose }) => {
    const [activeSection, setActiveSection] = useState(null);

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    return (
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Thông tin về đoạn chat</h2>
                <X className="cursor-pointer" size={20} onClick={onClose} />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Profile */}
                <div className="p-6 text-center border-b border-gray-200">
                    <img
                        src={conversation.avatarUrl}
                        alt={conversation.name}
                        className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                    />
                    <h3 className="font-semibold text-lg">{conversation.name}</h3>
                    <p className="text-sm text-gray-500">Đang hoạt động</p>
                </div>

                {/* Quick Actions */}
                <div className="p-4 border-b border-gray-200 flex justify-around">
                    <button className="flex flex-col items-center gap-2 hover:opacity-70">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Bell size={20} />
                        </div>
                        <span className="text-xs">Tắt thông báo</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 hover:opacity-70">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Search size={20} />
                        </div>
                        <span className="text-xs">Tìm kiếm</span>
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
                            <span className="font-medium">🎨 Tùy chỉnh đoạn chat</span>
                            <span>{activeSection === "customize" ? "▼" : "▶"}</span>
                        </button>
                        {activeSection === "customize" && (
                            <div className="px-4 pb-4 space-y-2">
                                <button className="w-full text-left py-2 hover:bg-gray-50 rounded">✏️ Đổi tên đoạn chat</button>
                                <button className="w-full text-left py-2 hover:bg-gray-50 rounded">🖼️ Thay đổi ảnh</button>
                                <button className="w-full text-left py-2 hover:bg-gray-50 rounded">💜 Đổi chủ đề</button>
                                <button className="w-full text-left py-2 hover:bg-gray-50 rounded">👍 Thay đổi biểu tượng cảm xúc</button>
                                <button className="w-full text-left py-2 hover:bg-gray-50 rounded">Aa Chỉnh sửa biệt danh</button>
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
                                <span className="font-medium">👥 Thành viên trong đoạn chat</span>
                                <span>{activeSection === "members" ? "▼" : "▶"}</span>
                            </button>
                            {activeSection === "members" && (
                                <div className="px-4 pb-4 space-y-2">
                                    {conversation.members.map((m) => (
                                        <div key={m.id} className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <img src={m.avatarUrl} className="w-10 h-10 rounded-full object-cover" />
                                                <div>
                                                    <div className="text-sm font-medium">{m.name}</div>
                                                    <div className="text-xs text-gray-500">{m.addedBy} đã thêm</div>
                                                </div>
                                            </div>
                                            <button className="text-gray-400 hover:text-gray-600">⋯</button>
                                        </div>
                                    ))}
                                    <button className="w-full py-2 flex items-center justify-center gap-2 hover:bg-gray-50 rounded">
                                        <UserPlus size={20} /> Thêm người
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
                            <span className="font-medium">📁 File phương tiện, file và liên kết</span>
                            <span>{activeSection === "media" ? "▼" : "▶"}</span>
                        </button>
                        {activeSection === "media" && (
                            <div className="px-4 pb-4 space-y-2">
                                <button className="w-full text-left py-2 hover:bg-gray-50 rounded flex items-center gap-2"><Image size={18} /> File phương tiện</button>
                                <button className="w-full text-left py-2 hover:bg-gray-50 rounded flex items-center gap-2"><File size={18} /> File</button>
                                <button className="w-full text-left py-2 hover:bg-gray-50 rounded flex items-center gap-2"><Link size={18} /> Liên kết</button>
                            </div>
                        )}
                    </div>

                    {/* Privacy & Support */}
                    <div className="border-b border-gray-200">
                        <button
                            className="w-full p-4 flex justify-between hover:bg-gray-50"
                            onClick={() => toggleSection("privacy")}
                        >
                            <span className="font-medium">🔒 Quyền riêng tư & hỗ trợ</span>
                            <span>{activeSection === "privacy" ? "▼" : "▶"}</span>
                        </button>
                        {activeSection === "privacy" && (
                            <div className="px-4 pb-4 space-y-2">
                                <button className="w-full text-left py-2 hover:bg-gray-50 rounded flex items-center gap-2"><BellOff size={18} /> Tắt thông báo</button>
                                <button className="w-full text-left py-2 hover:bg-gray-50 rounded flex items-center gap-2">👁️ Thông báo đã đọc</button>
                                <button className="w-full text-left py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-red-600">⚠️ Báo cáo</button>
                            </div>
                        )}
                    </div>

                    {/* Leave Group */}
                    {conversation.isGroup && (
                        <div className="p-4">
                            <button className="w-full py-3 text-red-600 hover:bg-red-50 rounded font-medium">
                                Rời nhóm
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatInfoPanel;
