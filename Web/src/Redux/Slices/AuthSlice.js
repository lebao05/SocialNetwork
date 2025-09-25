import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, registerAPI, logoutAPI } from "../../Apis/AuthApi";
import { getMeApi } from "../../Apis/UserApi";
import { updateBasicInfoApi } from "../../Apis/UserApi";
// =====================
// Thunks
// =====================

// 🔹 Login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await loginAPI({ email, password });
      return data; // ApiResponse from backend
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🔹 Register
export const register = createAsyncThunk(
  "auth/register",
  async (
    { firstName, lastName, email, password, dateOfBirth, gender },
    { rejectWithValue }
  ) => {
    try {
      const data = await registerAPI({
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
        gender,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const GetMe = createAsyncThunk(
  "auth/getme",
  async (_, { rejectWithValue }) => {
    try {
      console.log("GetMe called");
      const data = await getMeApi();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
// 🔹 Logout
export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutAPI();
  return true;
});

// =====================
// Initial state
// =====================
const initialState = {
  user: null, // logged-in user info
  loading: false,
  error: null,
  isInitialized: false,
};

// =====================
// Slice
// =====================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    updateAuthAvatarUrl: (state, action) => {
      if (state.profile) {
        state.profile.avatarUrl = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data; // unwrap ApiResponse
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });

    // REGISTER
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });

    builder
      .addCase(GetMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isInitialized = true;
      })
      .addCase(GetMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
        state.isInitialized = true;
      });

    // LOGOUT
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    });
  },
});

// =====================
// Export
// =====================
export const { resetAuthState, updateAuthAvatarUrl } = authSlice.actions;
export default authSlice.reducer;
