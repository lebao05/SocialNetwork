// src/redux/slices/currentProfileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProfileApi, updateBasicInfoApi } from "../../Apis/UserApi";
import {
  addWorkApi,
  updateWorkApi,
  deleteWorkApi,
  addEducationApi,
  updateEducationApi,
  deleteEducationApi,
} from "../../Apis/UserApi";
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

// 🔹 Work Thunks
export const addWork = createAsyncThunk(
  "profile/addWork",
  async (dto, { rejectWithValue }) => {
    try {
      const data = await addWorkApi(dto);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.Message || err.message);
    }
  }
);

export const updateWork = createAsyncThunk(
  "profile/updateWork",
  async (dto, { rejectWithValue }) => {
    try {
      const data = await updateWorkApi(dto);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.Message || err.message);
    }
  }
);

export const deleteWork = createAsyncThunk(
  "profile/deleteWork",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteWorkApi(id);
      return { id, ...data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.Message || err.message);
    }
  }
);

// 🔹 Education Thunks
export const addEducation = createAsyncThunk(
  "profile/addEducation",
  async (dto, { rejectWithValue }) => {
    try {
      const data = await addEducationApi(dto);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.Message || err.message);
    }
  }
);

export const updateEducation = createAsyncThunk(
  "profile/updateEducation",
  async (dto, { rejectWithValue }) => {
    try {
      const data = await updateEducationApi(dto);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.Message || err.message);
    }
  }
);

export const deleteEducation = createAsyncThunk(
  "profile/deleteEducation",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteEducationApi(id);
      return { id, ...data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.Message || err.message);
    }
  }
);
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
    updateUserCoverUrl: (state, action) => {
      if (state.profile) {
        state.profile.coverUrl = action.payload;
      }
    },
    updateUserAvatarUrl: (state, action) => {
      if (state.profile) {
        state.profile.avatarUrl = action.payload;
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
      }); // Work reducers
    builder
      .addCase(addWork.fulfilled, (state, action) => {
        state.profile.works = [
          ...(state.profile.works || []),
          action.payload.data,
        ];
      })
      .addCase(updateWork.fulfilled, (state, action) => {
        state.profile.works = state.profile.works.map((w) =>
          w.id === action.payload.data.id ? action.payload.data : w
        );
      })
      .addCase(deleteWork.fulfilled, (state, action) => {
        state.profile.works = state.profile.works.filter(
          (w) => w.id !== action.payload.id
        );
      });

    // Education reducers
    builder
      .addCase(addEducation.fulfilled, (state, action) => {
        state.profile.educations = [
          ...(state.profile.educations || []),
          action.payload.data,
        ];
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        state.profile.educations = state.profile.educations.map((e) =>
          e.id === action.payload.data.id ? action.payload.data : e
        );
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.profile.educations = state.profile.educations.filter(
          (e) => e.id !== action.payload.id
        );
      });
  },
});

// =====================
// Export
// =====================
export const { resetProfileState, updateUserCoverUrl, updateUserAvatarUrl } =
  currentUserSlice.actions;
export default currentUserSlice.reducer;
