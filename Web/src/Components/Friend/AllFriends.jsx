import {
  MoreVertical,
  MessageCircle,
  UserX,
  UserMinus,
  Ban,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const AllFriends = ({ sampleFriends }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  const toggleMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mt-6 w-full relative">
      <h3 className="text-lg font-semibold mb-2">All Friends</h3>
      <ul className="space-y-3">
        {sampleFriends.map((friend) => (
          <li
            key={friend.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 relative"
          >
            <img
              src={friend.avatar}
              alt={friend.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="font-medium">{friend.name}</p>
              <p className="text-sm text-gray-500">
                {friend.mutual} mutual friends
              </p>
            </div>

            {/* Three dot menu */}
            <div ref={menuRef} className="relative">
              <div
                onClick={() => toggleMenu(friend.id)}
                className="p-1 rounded-full hover:bg-gray-200 cursor-pointer"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </div>

              {openMenu === friend.id && (
                <div className="absolute p-1 left-0 mt-2 bg-white rounded-2xl shadow-md w-40 z-10 border">
                  <ul className="text-sm">
                    <li className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                      <MessageCircle className="w-4 h-4 text-gray-600" />
                      Message
                    </li>
                    <li className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                      <UserX className="w-4 h-4 text-gray-600" />
                      Unfriend
                    </li>
                    <li className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                      <UserMinus className="w-4 h-4 text-gray-600" />
                      Unfollow
                    </li>
                    <li className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-red-600">
                      <Ban className="w-4 h-4" />
                      Block
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllFriends;
