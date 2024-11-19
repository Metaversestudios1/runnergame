import React, { useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { GrUserManager } from "react-icons/gr";
import { PiWarehouse } from "react-icons/pi";
import { BsCollection } from "react-icons/bs";
import { BiSolidTrafficBarrier } from "react-icons/bi";
import { SiLevelsdotfyi } from "react-icons/si";

const Sidebar = ({ sidebar, toggleSideBar }) => {
  const [openSubMenu, setOpenSubMenu] = useState({
    client: false,
    property: false,
    agent: false,
    rank: false,
    setting: false,
  });
  const toggleSubMenu = (menu) => {
    setOpenSubMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };
  return (
    <>
      <div
        className={`h-full bg-[#4B49AC] w-[260px] flex-col  overflow-y-auto overflow-x-hidden ${
          sidebar ? "hidden" : "flex"
        } md:block`}
      >
        <div
          id="docs-sidebar"
          className={`bg-[#4B49AC]  hs-overlay   [--auto-close:lg] start-0 z-[60]  border-gray-200 pt-7 pb-10 overflow-y-auto sidebar
          }`}
        >
          <div className="px-6">
            <a
              className="flex-none text-xl font-semibold text-white"
              href="/"
              aria-label="Brand"
            >
              Admin
            </a>
          </div>
          <nav
            className="hs-accordion-group p-3 w-full flex flex-col flex-wrap mt-8"
            data-hs-accordion-always-open
          >
            <ul className="space-y-1.5">
              <li
                className=" hover:scale-105 transition-transform duration-200 "
                onClick={toggleSideBar}
              >
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#7978E9] rounded-lg"
                      : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:text-black hover:bg-white"
                  }
                >
                  <svg
                    className="size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <div className="text-sm">Dashboard</div>
                </NavLink>
              </li>
              <li
                className=" hover:scale-105 transition-transform duration-200 "
                id="users-accordion "
                onClick={toggleSideBar}
              >
                <NavLink
                  to="/collectibles"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#7978E9] rounded-lg"
                      : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:text-black hover:bg-white"
                  }
                >
                <BsCollection className="text-lg"/>
                  <div className="text-sm">Collectibles</div>
                </NavLink>
              </li>
              <li
                className=" hover:scale-105 transition-transform duration-200 "
                id="users-accordion "
                onClick={toggleSideBar}
              >
                <NavLink
                  to="/obstacles"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#7978E9] rounded-lg"
                      : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:text-black hover:bg-white"
                  }
                >
                <BiSolidTrafficBarrier className="text-lg"/>
                  <div className="text-sm">Obstacles</div>
                </NavLink>
              </li>
              <li
                className=" hover:scale-105 transition-transform duration-200 "
                id="users-accordion "
                onClick={toggleSideBar}
              >
                <NavLink
                  to="/levels"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#7978E9] rounded-lg"
                      : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:text-black hover:bg-white"
                  }
                >
                <SiLevelsdotfyi className="text-lg"/>
                  <div className="text-sm">Levels</div>
                </NavLink>
              </li>
              </ul>
              </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

          