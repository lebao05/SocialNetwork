import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/AuthSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer, // authReducer should be defined or imported
  },
  devTools: true, // Force enable DevTools
});
