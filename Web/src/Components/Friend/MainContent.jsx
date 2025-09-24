import { UserCircle } from "lucide-react";
import { useSelector } from "react-redux";
import ProfilePage from "../../Pages/ProfilePage";
import FriendRequestList from "./FriendRequestList";

// MainContent.js
const MainContent = ({ active }) => {
  const user = useSelector((state) => state.currentUser.profile);
  const sampleFriendRequests = [
    {
      id: 1,
      name: "Alice Johnson",
      img: "https://randomuser.me/api/portraits/women/1.jpg",
      mutual: 5,
    },
    {
      id: 2,
      name: "Bob Smith",
      img: "https://randomuser.me/api/portraits/men/2.jpg",
      mutual: 3,
    },
    {
      id: 3,
      name: "Charlie Davis",
      img: "https://randomuser.me/api/portraits/men/3.jpg",
      mutual: 8,
    },
    {
      id: 4,
      name: "Emma Wilson",
      img: "https://randomuser.me/api/portraits/women/4.jpg",
      mutual: 0,
    },
    {
      id: 5,
      name: "Daniel Lee",
      img: "https://randomuser.me/api/portraits/men/5.jpg",
      mutual: 2,
    },
    {
      id: 6,
      name: "Sophia Martinez",
      img: "https://randomuser.me/api/portraits/women/6.jpg",
      mutual: 7,
    },
    {
      id: 7,
      name: "Liam Brown",
      img: "https://randomuser.me/api/portraits/men/7.jpg",
      mutual: 1,
    },
    {
      id: 8,
      name: "Olivia Taylor",
      img: "https://randomuser.me/api/portraits/women/8.jpg",
      mutual: 4,
    },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {active === "home" && (
        <FriendRequestList friendRequests={sampleFriendRequests} />
      )}

      {active !== "home" && user && <ProfilePage unshowNavbar={true} />}

      {active !== "home" && !user && (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
          <UserCircle className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Choose a Friend</h3>
          <p className="text-gray-500 max-w-md">
            Select a name from the sidebar to view their profile and details.
          </p>
        </div>
      )}
    </div>
  );
};

export default MainContent;
