import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ProfilePage from "./Pages/ProfilePage";
import NotificationsPage from "./Pages/NotificationPage";
import CreateStoryPage from "./Pages/CreateStoryPage";
import RegisterForm from "./Components/RegisterForm";
import LoginForm from "./Components/LoginForm";

function App() {
  return (
    <>
      <Router>
        {" "}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/stories/create" element={<CreateStoryPage />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
