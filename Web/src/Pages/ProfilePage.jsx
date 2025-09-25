import { useState, useRef, useEffect } from "react";
import { Camera, Edit, MapPin, Users, Upload, Trash2, X } from "lucide-react";
import PostsTab from "../Components/Profile/PostsTab";
import FriendsTab from "../Components/Profile/FriendsTab";
import Navbar from "../Components/Home/NavBar";
import EditInfoModal from "../Components/Profile/EditInfoModal";
import FollowingTab from "../Components/Profile/FollowingTab";
import AboutTab from "../Components/Profile/AboutTab";
import Gray from "../Assets/gray.jpg";
import anonymous from "../Assets/anonymous.png";
import ImageSelectionModal from "../Components/Profile/ImageSelectionModal";
import { useDispatch } from "react-redux";
import {
  getProfile,
  updateUserAvatarUrl,
  updateUserCoverUrl,
} from "../Redux/Slices/CurrentUserSlice";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { uploadAvatarApi, uploadCoverApi } from "../Apis/UserApi";
import { updateAuthAvatarUrl } from "../Redux/Slices/AuthSlice";
export default function ProfilePage({ unshowNavbar }) {
  const dispatch = useDispatch();
  const [isEditInfoOpen, setIsEditInfoOpen] = useState(false);
  const [isAvatarSelectionOpen, setIsAvatarSelectionOpen] = useState(false);
  const [isCoverSelectionOpen, setIsCoverSelectionOpen] = useState(false);
  const { userId } = useParams();
  const profile = useSelector((state) => state.currentUser.profile);
  const [avatarImage, setAvatarImage] = useState();
  const [coverImage, setCoverImage] = useState();
  const handleUploadAvatar = async (file) => {
    if (!file) return;
    try {
      const res = await uploadAvatarApi(file);
      console.log(res);
      dispatch(updateUserAvatarUrl(res.data.avatarUrl));
      dispatch(updateAuthAvatarUrl(res.data.avatarUrl));
    } catch (err) {}
  };
  const handleUploadCover = async (file) => {
    if (!file) return;
    try {
      const res = await uploadCoverApi(file);
      dispatch(updateUserCoverUrl(res.data.coverUrl));
    } catch (err) {}
  };
  const tabs = ["Posts", "About", "Photos", "Videos", "Friends", "Following"];
  const [activeTab, setActiveTab] = useState("Posts");

  // Sample data (same as before)
  const friendsData = [
    {
      name: "Alice",
      img: "https://media.yeah1.com/files/ngoctran/2022/07/01/289693821_582015943280803_2102006602626651935_n-205941.jpg",
    },
    {
      name: "Bob",
      img: "https://media.yeah1.com/files/ngoctran/2022/07/01/289693821_582015943280803_2102006602626651935_n-205941.jpg",
    },
    { name: "Charlie", img: "https://via.placeholder.com/150" },
    { name: "Daisy", img: "https://via.placeholder.com/150" },
    { name: "Ethan", img: "https://via.placeholder.com/150" },
    { name: "Fiona", img: "https://via.placeholder.com/150" },
    { name: "George", img: "https://via.placeholder.com/150" },
    { name: "Hannah", img: "https://via.placeholder.com/150" },
    { name: "Ivy", img: "https://via.placeholder.com/150" },
  ];
  const followingData = [
    {
      name: "Alice",
      img: "https://media.yeah1.com/files/ngoctran/2022/07/01/289693821_582015943280803_2102006602626651935_n-205941.jpg",
    },
    {
      name: "Bob",
      img: "https://media.yeah1.com/files/ngoctran/2022/07/01/289693821_582015943280803_2102006602626651935_n-205941.jpg",
    },
    { name: "Charlie", img: "https://via.placeholder.com/150" },
    { name: "Daisy", img: "https://via.placeholder.com/150" },
    { name: "Ethan", img: "https://via.placeholder.com/150" },
    { name: "Fiona", img: "https://via.placeholder.com/150" },
    { name: "George", img: "https://via.placeholder.com/150" },
    { name: "Hannah", img: "https://via.placeholder.com/150" },
    { name: "Ivy", img: "https://via.placeholder.com/150" },
  ];
  const videosData = [{ url: "/sample1.mp4" }, { url: "/sample2.mp4" }];

  const imagesData = [
    { url: "/image1.jpg" },
    { url: "/image2.jpg" },
    { url: "/image3.jpg" },
  ];
  const myPosts = [
    {
      id: 1,
      content:
        "Just finished an amazing hike in the mountains! The view was absolutely breathtaking. Nature never fails to inspire me. 🏔️",
      image:
        "https://media.yeah1.com/files/ngoctran/2022/07/01/289693821_582015943280803_2102006602626651935_n-205941.jpg",
      likes: 24,
      comments: 8,
      shares: 3,
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      content:
        "Excited to share that I just completed my certification in web development! Ready to take on new challenges and build amazing things. 💻",
      likes: 45,
      comments: 12,
      shares: 6,
      timestamp: "1 day ago",
    },
    {
      id: 3,
      content:
        "Coffee and code - the perfect combination for a productive morning. What's your favorite way to start the day?",
      likes: 18,
      comments: 5,
      shares: 2,
      timestamp: "3 days ago",
    },
  ];

  const profilePhotos = Array(6).fill(avatarImage);

  const handleDeleteAvatar = () => setAvatarImage("");

  const handleDeleteCover = () => setCoverImage("");
  useEffect(() => {
    if (userId) {
      dispatch(getProfile(userId));
    }
  }, [dispatch, userId]);
  useEffect(() => {
    if (profile) {
      setAvatarImage(profile.avatarUrl || "");
      setCoverImage(profile.coverUrl || "");
    }
  }, [profile]);
  return (
    <div>
      {!unshowNavbar && <Navbar />}
      <div className="min-h-screen bg-gray-100">
        <div className="p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Cover Photo and Profile Info */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative">
                {/* Cover Photo */}
                <div
                  className="h-80 bg-gradient-to-r from-blue-400 to-blue-600"
                  onClick={() => setIsCoverSelectionOpen(true)}
                >
                  <img
                    src={coverImage || Gray}
                    alt="Cover"
                    className="w-full h-full object-cover hover:opacity-95 cursor-pointer transition-opacity"
                  />

                  <button className="absolute bottom-4 right-4 flex items-center px-3 py-1 bg-white rounded shadow hover:bg-gray-100 text-sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Edit Cover Photo
                  </button>
                </div>

                {/* Profile Picture */}
                <div className="absolute -bottom-16 left-8">
                  <div className="relative rounded-full bg-white">
                    <img
                      src={avatarImage || anonymous}
                      alt="User"
                      className="h-32 w-32 rounded-full border-4 border-white object-cover hover:opacity-90 cursor-pointer transition-opacity"
                      onClick={() => setIsAvatarSelectionOpen(true)}
                    />
                    <button
                      onClick={() => setIsAvatarSelectionOpen(true)}
                      className="absolute bottom-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-20 pb-6 px-6">
                <div className="flex items-start justify-between flex-wrap">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile
                        ? `${profile.firstName} ${profile.lastName}`
                        : ""}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Software Developer & Mountain Enthusiast
                    </p>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 flex-wrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {profile ? profile.currentLocation : "Unknown City"}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        1,234 friends
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3 md:mt-0">
                    <button className="flex items-center px-3 py-1 border rounded hover:bg-gray-100 text-sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                      Add Story
                    </button>
                  </div>
                </div>
                <div className="mt-6 border-t border-gray-200">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-3 text-sm hover:bg-gray-100 rounded-xs cursor-pointer font-medium transition-colors ${
                        activeTab === tab
                          ? "border-b-2 border-blue-500 text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Modals */}
            <EditInfoModal
              isOpen={isEditInfoOpen}
              setIsOpen={setIsEditInfoOpen}
            />

            <ImageSelectionModal
              isOpen={isAvatarSelectionOpen}
              onClose={() => setIsAvatarSelectionOpen(false)}
              onUpload={handleUploadAvatar}
              onDelete={handleDeleteAvatar}
              title="Choose Profile Picture"
              showDelete={true}
              type="avatar" // 👈 shows circle validation
            />

            <ImageSelectionModal
              isOpen={isCoverSelectionOpen}
              onClose={() => setIsCoverSelectionOpen(false)}
              onUpload={handleUploadCover}
              onDelete={handleDeleteCover}
              title="Choose Cover Photo"
              showDelete={true}
              type="cover" // 👈 shows rectangle opacity validation
            />

            {/* Tabs */}
            {activeTab === "Posts" && (
              <PostsTab
                myPosts={myPosts}
                profilePhotos={profilePhotos}
                setIsOpen={setIsEditInfoOpen}
                isOpen={isEditInfoOpen}
              />
            )}
            {activeTab === "Friends" && (
              <FriendsTab friendsData={friendsData} />
            )}
            {activeTab === "Videos" && (
              <div className="bg-white rounded-lg shadow p-6">...</div>
            )}
            {activeTab === "Photos" && (
              <div className="bg-white rounded-lg shadow p-6">...</div>
            )}
            {activeTab === "Following" && (
              <FollowingTab followingData={followingData} />
            )}
            {activeTab === "About" && <AboutTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
