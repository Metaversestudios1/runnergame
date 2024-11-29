import React, { useState } from "react";
import { FaAngleDown, FaUsers, FaAngleRight } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { BsCollection } from "react-icons/bs";
import { BiSolidTrafficBarrier } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { GiGooeyImpact } from "react-icons/gi";
import { LuShoppingCart } from "react-icons/lu";
import { MdOutlineEventAvailable } from "react-icons/md";


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
      {sidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSideBar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          sidebar ? "translate-x-0" : "-translate-x-full"
        }  md:translate-x-0 md:relative md:flex`}
      >
        <div
          id="docs-sidebar"
          className={`w-[240px] bg-white hs-overlay h-full  [--auto-close:lg] start-0 z-[60]  border-gray-200 pt-7 pb-10 overflow-y-auto sidebar
          }`}
        >
          <div className="flex justify-end">
            <RxCross2
              className="md:hidden cursor-pointer mx-5 text-2xl "
              onClick={toggleSideBar}
            />
          </div>
          <div className="px-6">
            <a
              className="flex-none text-xl font-semibold "
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
                      : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text- rounded-lg hover:text-black hover:bg-white"
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
                  to="/players"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#7978E9] rounded-lg"
                      : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text- rounded-lg hover:text-black hover:bg-white"
                  }
                >
                  <FaUsers className="text-lg " />
                  <div className="text-sm">Players</div>
                </NavLink>
              </li>
              <li
                className=" hover:scale-105 transition-transform duration-200 "
                id="users-accordion "
                onClick={toggleSideBar}
              >
                <NavLink
                  to="/items"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#7978E9] rounded-lg"
                      : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text- rounded-lg hover:text-black hover:bg-white"
                  }
                >
                  <LuShoppingCart className="text-lg " />
                  <div className="text-sm">Shop items</div>
                </NavLink>
              </li>
              <li
                className=" hover:scale-105 transition-transform duration-200 "
                id="users-accordion "
                onClick={toggleSideBar}
              >
                <NavLink
                  to="/events"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#7978E9] rounded-lg"
                      : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text- rounded-lg hover:text-black hover:bg-white"
                  }
                >
                  <MdOutlineEventAvailable className="text-lg " />
                  <div className="text-sm">Events</div>
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

// <li
//   className=" hover:scale-105 transition-transform duration-200 "
//   id="users-accordion "
//   onClick={toggleSideBar}
// >
//   <NavLink
//     to="/collectibles"
//     className={({ isActive }) =>
//       isActive
//         ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#7978E9] rounded-lg"
//         : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text- rounded-lg hover:text-black hover:bg-white"
//     }
//   >
//     <BsCollection className="text-lg" />
//     <div className="text-sm">Collectibles</div>
//   </NavLink>
// </li>
// <li
//   className=" hover:scale-105 transition-transform duration-200 "
//   id="users-accordion "
//   onClick={toggleSideBar}
// >
//   <NavLink
//     to="/obstacles"
//     className={({ isActive }) =>
//       isActive
//         ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#7978E9] rounded-lg"
//         : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text- rounded-lg hover:text-black hover:bg-white"
//     }
//   >
//     <BiSolidTrafficBarrier className="text-lg" />
//     <div className="text-sm">Obstacles</div>
//   </NavLink>
// </li>
// <li
//   className=" hover:scale-105 transition-transform duration-200 "
//   id="users-accordion "
//   onClick={toggleSideBar}
// >
//   <NavLink
//     to="/initialsetting"
//     className={({ isActive }) =>
//       isActive
//         ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#7978E9] rounded-lg"
//         : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text- rounded-lg hover:text-black hover:bg-white"
//     }
//   >
//     <IoSettingsOutline className="text-lg" />
//     <div className="text-sm">Initial Setting</div>
//   </NavLink>
// </li>
// <li
//   className=" hover:scale-105 transition-transform duration-200 "
//   id="users-accordion "
//   onClick={toggleSideBar}
// >
//   <NavLink
//     to="/impact"
//     className={({ isActive }) =>
//       isActive
//         ? "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white bg-[#7978E9] rounded-lg"
//         : "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text- rounded-lg hover:text-black hover:bg-white"
//     }
//   >
//     <GiGooeyImpact className="text-lg" />
//     <div className="text-sm">Impact</div>
//   </NavLink>
// </li>