import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import LeftSideBar from "./LeftSideBar";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar at the top */}
      <Navbar />

      {/* Main layout grid below Navbar */}
      <div className="grid grid-cols-1 md:grid-cols-[270px_1fr] flex-grow">
        {/* Sidebar (only visible on md and up) */}
        <LeftSideBar />

        {/* Main content area */}
        <div className="bg-[#0c0c36]  overflow-y-auto min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;