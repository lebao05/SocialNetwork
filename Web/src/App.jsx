import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateStoryPage from "./Pages/CreateStoryPage";
import RegisterForm from "./Components/Security/RegisterForm";
import LoginForm from "./Components/Security/LoginForm";
import NotificationsPage from "./Pages/NotificationPage";
import ProfilePage from "./Pages/ProfilePage";
import HomePage from "./Pages/HomePage";
import { useDispatch, useSelector } from "react-redux";
import { GetMe } from "./Redux/Slices/AuthSlice";
import ProtectedRoute from "./Components/Security/ProtectedRoute";
import FriendPage from "./Pages/FriendPage";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(GetMe());
  }, [dispatch]);
  const { isInitialized } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.user);
  if (!isInitialized) {
    return null;
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute user={user}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute user={user}>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stories/create"
            element={
              <ProtectedRoute user={user}>
                <CreateStoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friends/:userId"
            element={
              <ProtectedRoute user={user}>
                <FriendPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friends"
            element={
              <ProtectedRoute user={user}>
                <FriendPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
