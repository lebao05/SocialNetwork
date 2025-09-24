import { Home, UserPlus, UserCheck, Users, Gift } from "lucide-react";
import FriendRequests from "./FriendRequests";
import FriendSuggestions from "./FriendSuggestions";
import AllFriends from "./AllFriends";
import Birthdays from "./Birthdays";

const Sidebar = ({ active, setActive }) => {
  // Sample Data
  const sampleFriendRequests = [
    {
      id: 1,
      name: "Alice Johnson",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      mutual: 5,
      date: "2 days ago",
    },
    {
      id: 2,
      name: "Bob Smith",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      mutual: 8,
      date: "5 hours ago",
    },
  ];

  const sampleSuggestions = [
    {
      id: 1,
      name: "Emily Carter",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      mutual: 3,
    },
    {
      id: 2,
      name: "Daniel White",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      mutual: 6,
    },
  ];

  const sampleFriends = [
    {
      id: 1,
      name: "Sophia Brown",
      avatar: "https://randomuser.me/api/portraits/women/6.jpg",
      mutual: 12,
    },
    {
      id: 2,
      name: "James Wilson",
      avatar: "https://randomuser.me/api/portraits/men/7.jpg",
      mutual: 7,
    },
    {
      id: 3,
      name: "Olivia Green",
      avatar: "https://randomuser.me/api/portraits/women/8.jpg",
      mutual: 20,
    },
  ];

  const sampleBirthdays = [
    {
      id: 1,
      name: "Michael Johnson",
      avatar: "https://randomuser.me/api/portraits/men/9.jpg",
      birthday: "Today 🎂",
    },
    {
      id: 2,
      name: "Emma Davis",
      avatar: "https://randomuser.me/api/portraits/women/10.jpg",
      birthday: "Tomorrow 🎉",
    },
  ];

  const menu = [
    { label: "Home", icon: Home, key: "home" },
    { label: "Friend Requests", icon: UserPlus, key: "requests" },
    { label: "Suggestions", icon: UserCheck, key: "suggestions" },
    { label: "All Friends", icon: Users, key: "all" },
    { label: "Birthdays", icon: Gift, key: "birthdays" },
  ];

  return (
    <div className="w-100 bg-white border-r border-gray-300 p-4 sticky top-0 h-screen">
      <h2 className="text-xl font-bold mb-4">Friends</h2>

      {/* Navigation Menu */}
      <ul className="space-y-2">
        {menu.map((item) => (
          <li
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer 
              ${
                active === item.key
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-gray-200"
              }
            `}
          >
            <item.icon
              className={`w-5 h-5 ${
                active === item.key ? "text-blue-600" : "text-blue-500"
              }`}
            />
            {item.label}
          </li>
        ))}
      </ul>

      {/* Sections */}
      {active === "requests" && (
        <FriendRequests sampleFriendRequests={sampleFriendRequests} />
      )}

      {active === "suggestions" && (
        <FriendSuggestions sampleSuggestions={sampleSuggestions} />
      )}

      {active === "all" && <AllFriends sampleFriends={sampleFriends} />}

      {active === "birthdays" && (
        <Birthdays sampleBirthdays={sampleBirthdays} />
      )}
    </div>
  );
};

export default Sidebar;
