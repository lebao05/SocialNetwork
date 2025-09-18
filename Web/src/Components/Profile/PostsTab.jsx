import CreatePost from "../Post/CreatePost";
import Post from "../Post/Post";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Heart,
  Calendar,
  ImageIcon,
  Users,
} from "lucide-react";

export default function PostsTab({
  myPosts,
  profilePhotos,
  setIsOpen,
  isOpen,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        {/* About */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
          <div className="space-y-3 text-gray-700">
            <div>
              <p className="font-semibold text-gray-800">Bio</p>
              <p>
                Passionate developer who loves building products and hiking
                mountains 🌄
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Briefcase className="h-5 w-5 text-gray-400" />
              <span>Works at Tech Innovations Inc.</span>
            </div>
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-5 w-5 text-gray-400" />
              <span>Studied Computer Science at Stanford University</span>
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
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full mt-4 px-3 py-2 border rounded hover:bg-gray-100 text-sm"
          >
            Edit Details
          </button>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Photos</h2>
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

        {/* Friends preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Friends</h2>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center cursor-pointer"
              >
                <img
                  src="https://via.placeholder.com/150"
                  alt={`Friend ${i}`}
                  className="h-20 w-20 rounded-lg object-cover mb-1 hover:opacity-80"
                />
                <span className="text-sm text-gray-700 truncate w-full">
                  Friend {i + 1}
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
        <CreatePost />
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
  );
}
