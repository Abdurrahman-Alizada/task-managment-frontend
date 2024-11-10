import React, { useEffect, useState } from "react";
import { RiTaskLine } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import {
  MdOutlineKeyboardArrowDown,
  MdAssignment,
  MdDashboard,
  MdPeople,
  MdSettings,
} from "react-icons/md";
import ThemeSwitch from "./themeswitch";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetCurrentLoginUserQuery } from "../redux/reducers/user/userThunk";
import { handleCurrentLoaginUser } from "../redux/reducers/user/user";

const navigationLinks = {
  Admin: [
    { name: "Dashboard", icon: MdDashboard, path: "/admin/dashboard" },
    { name: "User Management", icon: FaUsers, path: "/admin/users" },
    { name: "Tasks Management", icon: MdAssignment, path: "/admin/tasks" },
  ],
  Manager: [
    { name: "Dashboard", icon: MdDashboard, path: "/manager/dashboard" },
    { name: "Tasks", icon: MdAssignment, path: "/manager/tasks" },
    { name: "Users", icon: MdPeople, path: "/manager/users" },
  ],
  RegularUser: [
    { name: "Dashboard", icon: MdDashboard, path: "/user/dashboard" },
    { name: "Tasks", icon: MdAssignment, path: "/user/tasks" },
  ],
};

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useSelector((state) => state.theme.theme);

  const { data: currentUser } = useGetCurrentLoginUserQuery();
  useEffect(() => {
    if (currentUser?.user) {
      dispatch(
        handleCurrentLoaginUser({
          ...currentUser?.user,
          role: currentUser?.role,
        })
      );
    }
  }, [currentUser]);

  const userRole = currentUser?.role || "RegularUser";
  const links = navigationLinks[userRole] || navigationLinks.RegularUser;

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };
  const currentLoginUser = useSelector((state) => state.user.currentLoginUser);
console.log("first wd",currentLoginUser)
  return (
    <div
      className={`w-full ${
        theme === "dark" ? "bg-slate-800" : "bg-gray-50"
      } flex items-center justify-between px-6 py-4 shadow-sm`}
    >
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-violet-700 rounded-xl">
          <RiTaskLine className="text-white text-3xl hover:animate-spin" />
        </div>
        <span
          className={`text-xl font-bold ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          {userRole} Dashboard
        </span>
      </div>

      <div className="hidden md:flex items-center gap-4">
        {links.map((link) => (
          <div
            key={link.path}
            className={`flex items-center gap-2 cursor-pointer ${
              location.pathname === link.path
                ? "bg-violet-700 text-white"
                : `${
                    theme === "dark"
                      ? "text-gray-400 hover:bg-slate-700"
                      : "text-gray-700 hover:bg-violet-100"
                  }`
            } px-6 py-2 rounded-full transition-all duration-300`}
            onClick={() => handleNavigation(link.path)}
          >
            <link.icon className="text-xl" />
            <span>{link.name}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-6">
        {/* <ThemeSwitch /> */}

        <div
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          // onMouseLeave={() => {
          //   setTimeout(() => {
          //     setIsDropdownOpen(false);
          //   }, 500);
          // }}
        >
          <div className="flex items-center gap-2 cursor-pointer">
            <div
              className={`w-10 h-10 md:w-12 md:h-12 ${
                theme === "dark"
                  ? "bg-violet-900 text-violet-300"
                  : "bg-violet-200 text-violet-700"
              } rounded-full flex items-center justify-center font-bold text-lg`}
            >
              {currentLoginUser?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="hidden md:block">
              <p
                className={`text-lg font-medium ${
                  theme === "dark" ? "text-gray-400" : "text-black"
                }`}
              >
                {currentLoginUser?.name || "User"}
              </p>
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-gray-500" : "text-gray-700"
                }`}
              >
                {currentLoginUser?.email || "user@example.com"}
              </span>
            </div>
            <MdOutlineKeyboardArrowDown
              className={`hidden md:block text-2xl ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            />
          </div>

          {isDropdownOpen && (
            <div
              className={`absolute right-0 top-full mt-2 w-48 ${
                theme === "dark" ? "bg-slate-700" : "bg-white"
              } rounded-lg shadow-lg py-2 z-50`}
            >
              <button
                className={`w-full text-left px-4 py-2 text-red-600 ${
                  theme === "dark" ? "hover:bg-slate-600" : "hover:bg-gray-100"
                } transition-colors duration-150`}
                onClick={() => {
                  handleLogout();
                  setIsDropdownOpen(false);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
