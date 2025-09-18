import React from "react";
import Post from "../Post/Post";
import Stories from "../Story/Stories";
import CreatePost from "../Post/CreatePost";

const dummyStories = [
  { id: 1, name: "Sarah", image: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Mike", image: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Emma", image: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "David", image: "https://i.pravatar.cc/150?img=4" },
  { id: 5, name: "Lisa", image: "https://i.pravatar.cc/150?img=5" },
  { id: 6, name: "John", image: "https://i.pravatar.cc/150?img=6" },
];

const dummyPosts = [
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

export default function Feed() {
  return (
    <div className="flex-1 px-4">
      {/* Stories */}
      <CreatePost />
      <Stories stories={dummyStories} />
      {dummyPosts.map((p, i) => (
        <Post key={i} {...p} />
      ))}
    </div>
  );
}
