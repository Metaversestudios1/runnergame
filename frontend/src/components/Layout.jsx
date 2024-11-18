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
    <div className="flex h-screen">
      <Sidebar
        sidebar={sideBar}
        className=""
        toggleSideBar={toggleSideBar}
      />
      <div className="flex flex-col flex-grow overflow-y-auto w-full">
        <Navbar toggleSideBar={toggleSideBar} />
        <Outlet/>
      </div>
    </div>
  );
};

export default Layout;
