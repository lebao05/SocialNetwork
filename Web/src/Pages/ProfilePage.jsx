import { useState } from "react";
import {
  Camera,
  Edit,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Calendar,
  Users,
  ImageIcon,
  MessageCircle,
} from "lucide-react";
import Navbar from "../Components/NavBar";
import Post from "../Components/Post";
import CreatePost from "../Components/CreatePost";

export default function ProfilePage() {
  const tabs = ["Posts", "About", "Photos", "Videos", "Friends", "Following"];
  const [activeTab, setActiveTab] = useState("Posts");

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

  // Replace photo gallery with same URL
  const profilePhotos = Array(6).fill(
    "https://media.yeah1.com/files/ngoctran/2022/07/01/289693821_582015943280803_2102006602626651935_n-205941.jpg"
  );

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Cover Photo and Profile Info */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative">
                {/* Cover Photo */}
                <div className="h-80 bg-gradient-to-r from-blue-400 to-blue-600">
                  <img
                    src="https://media.yeah1.com/files/ngoctran/2022/07/01/289693821_582015943280803_2102006602626651935_n-205941.jpg"
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute bottom-4 right-4 flex items-center px-3 py-1 bg-white rounded shadow hover:bg-gray-100 text-sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Edit Cover Photo
                  </button>
                </div>

                {/* Profile Picture */}
                <div className="absolute -bottom-16 left-8">
                  <div className="relative">
                    <img
                      src="https://media.yeah1.com/files/ngoctran/2022/07/01/289693821_582015943280803_2102006602626651935_n-205941.jpg"
                      alt="User"
                      className="h-32 w-32 rounded-full border-4 border-white object-cover"
                    />
                    <button className="absolute bottom-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-20 pb-6 px-6">
                <div className="flex items-start justify-between flex-wrap">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      John Doe
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Software Developer & Mountain Enthusiast
                    </p>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 flex-wrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        San Francisco, CA
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
                </div>{" "}
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

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* About */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    About
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <div>
                      <p className="font-semibold text-gray-800">Bio</p>
                      <p>
                        Passionate developer who loves building products and
                        hiking mountains 🌄
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                      <span>Works at Tech Innovations Inc.</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="h-5 w-5 text-gray-400" />
                      <span>
                        Studied Computer Science at Stanford University
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span>Lives in San Francisco, California</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Heart className="h-5 w-5 text-gray-400" />
                      <span>In a relationship</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <span>Joined March 2020</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 px-3 py-2 border rounded hover:bg-gray-100 text-sm">
                    Edit Details
                  </button>
                </div>

                {/* Photos */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Photos
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    {profilePhotos.map((url, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                      >
                        <img
                          src={url}
                          alt={`Photo ${i + 1}`}
                          className="w-full h-full object-cover hover:opacity-75 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 px-3 py-2 border rounded hover:bg-gray-100 text-sm flex items-center justify-center">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    See All Photos
                  </button>
                </div>
                {/* Friends */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Friends
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        name: "Alice",
                        img: "https://media.yeah1.com/files/ngoctran/2022/07/01/289693821_582015943280803_2102006602626651935_n-205941.jpg",
                      },
                      {
                        name: "Bob",
                        img: "https://media.yeah1.com/files/ngoctran/2022/07/01/289693821_582015943280803_2102006602626651935_n-205941.jpg",
                      },
                      {
                        name: "Charlie",
                        img: "https://media.yeah1.com/files/ngoctran/2022/07/01/289693821_582015943280803_2102006602626651935_n-205941.jpg",
                      },
                      {
                        name: "Daisy",
                        img: "https://media.yeah1.com/files/ngoctran/2022/07/01/289693821_582015943280803_2102006602626651935_n-205941.jpg",
                      },
                      {
                        name: "Ethan",
                        img: "https://media.yeah1.com/files/ngoctran/2022/07/01/289693821_582015943280803_2102006602626651935_n-205941.jpg",
                      },
                      {
                        name: "Fiona",
                        img: "https://media.yeah1.com/files/ngoctran/2022/07/01/289693821_582015943280803_2102006602626651935_n-205941.jpg",
                      },
                    ].map((friend, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center text-center cursor-pointer"
                      >
                        <img
                          src={friend.img}
                          alt={friend.name}
                          className="h-20 w-20 rounded-lg object-cover mb-1 hover:opacity-80"
                        />
                        <span className="text-sm text-gray-700 truncate w-full">
                          {friend.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 px-3 py-2 border rounded hover:bg-gray-100 text-sm flex items-center justify-center">
                    <Users className="h-4 w-4 mr-2" />
                    See All Friends
                  </button>
                </div>
              </div>

              {/* Right Column - Posts */}
              <div className="lg:col-span-2 space-y-6">
                {/* Create Post */}
                <CreatePost />

                {/* Posts */}
                {myPosts.map((post) => (
                  <Post
                    key={post.id}
                    user="John Doe"
                    content={post.content}
                    image={post.image}
                    likes={post.likes}
                    comments={post.comments}
                    shares={post.shares}
                    timestamp={post.timestamp}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
