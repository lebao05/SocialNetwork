// src/redux/slices/currentProfileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProfileApi, updateBasicInfoApi } from "../../Apis/UserApi";
// =====================
// Thunks
// =====================

// 🔹 Get Profile by userId
export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await getProfileApi(userId);
      return data; // ApiResponse from backend
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const updateBasicInfo = createAsyncThunk(
  "auth/updateBasicInfo",
  async (dto, { rejectWithValue }) => {
    try {
      const data = await updateBasicInfoApi(dto);
      console.log("UpdateBasicInfo response:", data);
      return data; // { Message: "Successfully" }
    } catch (err) {
      return rejectWithValue(err.response?.data?.Message || err.message);
    }
  }
);
// =====================
// Initial state
// =====================
const initialState = {
  profile: null,
  loading: false,
  error: null,
};

// =====================
// Slice
// =====================
const currentUserSlice = createSlice({
  name: "currentProfile",
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
    updateCoverUrl: (state, action) => {
      if (state.profile) {
        state.profile.coverUrl = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // GET PROFILE
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data; // unwrap ApiResponse
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Get profile failed";
      });

    builder
      .addCase(updateBasicInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBasicInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = {
          ...state.profile,
          ...action.payload.data,
        };
      })
      .addCase(updateBasicInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Update failed";
      });
  },
});

// =====================
// Export
// =====================
export const { resetProfileState } = currentUserSlice.actions;
export default currentUserSlice.reducer;
