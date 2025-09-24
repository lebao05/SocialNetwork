// src/Apis/FriendApi.js
import axios from "../Configs/Axios";

// ✅ Send a friend request
export const sendFriendRequestApi = async (userId) => {
  const res = await axios.post(`/friend/send/${userId}`);
  return res.data;
};

// ✅ Accept a friend request
export const acceptFriendRequestApi = async (requestId) => {
  const res = await axios.post(`/friend/accept/${requestId}`);
  return res.data;
};

// ✅ Delete a friend request
export const deleteFriendRequestApi = async (requestId) => {
  const res = await axios.delete(`/friend/request/${requestId}`);
  return res.data;
};

// ✅ Delete a friendship
export const deleteFriendApi = async (userId) => {
  const res = await axios.delete(`/friend/${userId}`);
  return res.data;
};

// ✅ Get all friends of current user
export const getFriendsApi = async () => {
  const res = await axios.get(`/friend`);
  return res.data;
};

// ✅ Get all friend requests of current user
export const getFriendRequestsApi = async () => {
  const res = await axios.get(`/friend/requests`);
  return res.data;
};
