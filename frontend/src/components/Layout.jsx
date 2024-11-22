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
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar at the top */}
      <Navbar toggleSideBar={toggleSideBar} />

      {/* Sidebar and Content */}
      <div className="flex flex-1 h-full">
        {/* Sidebar */}
        <Sidebar sidebar={sideBar} toggleSideBar={toggleSideBar} />

        {/* Main Content (Outlet) */}
        <div className="flex-grow p-4 bg-gray-100 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
