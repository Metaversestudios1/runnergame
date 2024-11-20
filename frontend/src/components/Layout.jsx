import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  const [sideBar, setSideBar] = useState(true);
  const toggleSideBar = () => {
    setSideBar(!sideBar);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar at the top */}
      <Navbar toggleSideBar={toggleSideBar} />

      {/* Sidebar and Content */}
      <div className="flex flex-1">
        {/* Sidebar occupying 2/10th of the width */}
        <Sidebar
          sidebar={sideBar}
          toggleSideBar={toggleSideBar}
         
        />

        {/* Main Content (Outlet) taking the rest */}
        <div className="flex-grow p-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
