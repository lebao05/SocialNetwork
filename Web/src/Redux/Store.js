import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/AuthSlice";
import currentUserReducer from "./Slices/CurrentUserSlice";
import friendReducer from "./Slices/FriendSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer, // authReducer should be defined or imported
    currentUser: currentUserReducer,
    friend: friendReducer,
  },
  devTools: true, // Force enable DevTools
});
