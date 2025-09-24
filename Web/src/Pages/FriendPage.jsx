// FriendPage.js
import { useState } from "react";
import Sidebar from "../Components/Friend/SideBar";
import MainContent from "../Components/Friend/MainContent";
import Navbar from "../Components/Home/NavBar";

const FriendPage = () => {
  const [active, setActive] = useState("home");

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-gray-100">
        <Sidebar active={active} setActive={setActive} />
        <MainContent active={active} />
      </div>
    </>
  );
};

export default FriendPage;
