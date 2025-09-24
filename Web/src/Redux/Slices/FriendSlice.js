import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  sendFriendRequestApi,
  acceptFriendRequestApi,
  deleteFriendRequestApi,
  deleteFriendApi,
  getFriendsApi,
  getFriendRequestsApi,
} from "../../Apis/FriendApi";

// =====================
// Thunks
// =====================

// 🔹 Get all friends
export const getFriends = createAsyncThunk(
  "friend/getFriends",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFriendsApi();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🔹 Get all friend requests
export const getFriendRequests = createAsyncThunk(
  "friend/getFriendRequests",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFriendRequestsApi();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🔹 Send friend request
export const sendFriendRequest = createAsyncThunk(
  "friend/sendFriendRequest",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await sendFriendRequestApi(userId);
      return { userId, data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🔹 Accept friend request
export const acceptFriendRequest = createAsyncThunk(
  "friend/acceptFriendRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const data = await acceptFriendRequestApi(requestId);
      return { requestId, data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🔹 Delete friend request
export const deleteFriendRequest = createAsyncThunk(
  "friend/deleteFriendRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const data = await deleteFriendRequestApi(requestId);
      return { requestId, data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🔹 Delete a friend
export const deleteFriend = createAsyncThunk(
  "friend/deleteFriend",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await deleteFriendApi(userId);
      return { userId, data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// =====================
// Initial State
// =====================
const initialState = {
  friends: [],
  friendRequests: [],
  loading: false,
  error: null,
};

// =====================
// Slice
// =====================
const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    resetFriendState: (state) => {
      state.friends = [];
      state.friendRequests = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ===== Get Friends =====
    builder
      .addCase(getFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload.data;
      })
      .addCase(getFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== Get Friend Requests =====
    builder
      .addCase(getFriendRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFriendRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.friendRequests = action.payload.data;
      })
      .addCase(getFriendRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== Send Friend Request =====
    builder.addCase(sendFriendRequest.fulfilled, (state, action) => {
      // Optionally, push into friendRequests (depending on API return)
      state.friendRequests.push(action.payload.data);
    });

    // ===== Accept Friend Request =====
    builder.addCase(acceptFriendRequest.fulfilled, (state, action) => {
      state.friendRequests = state.friendRequests.filter(
        (r) => r.id !== action.payload.requestId
      );
      // Optionally, push new friend into friends
      if (action.payload.data?.friend) {
        state.friends.push(action.payload.data.friend);
      }
    });

    // ===== Delete Friend Request =====
    builder.addCase(deleteFriendRequest.fulfilled, (state, action) => {
      state.friendRequests = state.friendRequests.filter(
        (r) => r.id !== action.payload.requestId
      );
    });

    // ===== Delete Friend =====
    builder.addCase(deleteFriend.fulfilled, (state, action) => {
      state.friends = state.friends.filter(
        (f) => f.id !== action.payload.userId
      );
    });
  },
});

// =====================
// Export
// =====================
export const { resetFriendState } = friendSlice.actions;
export default friendSlice.reducer;
