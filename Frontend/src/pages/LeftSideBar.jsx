import { Link, useLocation } from "react-router-dom";
import { Users, Heart, PlusSquare, User, Network } from "lucide-react";
import { GoFileMedia } from "react-icons/go";
import { useEffect, useState } from "react";
import instance from "../axiosConfig";

const LeftSideBar = () => {
  const location = useLocation();

  const [notification, setNotification] = useState([]);

  useEffect(() => {
    fetchUserAndProfiles();
  }, []);

  async function fetchUserAndProfiles() {
    try {
      const userRes = await instance.get("/api/users/me");
      const mainUser = userRes?.data;

      await fetchFriendData(mainUser?.uniqueId);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchFriendData(userId) {
    try {
      const response = await instance.get(`/api/users/request/${userId}`);
      console.log(response.data);
      setNotification(response?.data?.receivedRequests); 
    } catch (error) {
      console.error("Error fetching friend data:", error);
    }
  }

  return (
    <div className="hidden md:pt-17 md:flex md:w-[270px] h-screen bg-gradient-to-br from-blue-900 via-blue-900 to-indigo-900 text-white p-6 shadow-2xl sticky top-0 z-40 backdrop-blur-xl bg-opacity-80 overflow-hidden">
      {/* Animated background dots */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
        <div
          className="absolute top-8 left-1/4 w-3 h-3 bg-white/20 rounded-full animate-bounce delay-100"
          style={{ animationDelay: "100ms" }}
        ></div>
        <div
          className="absolute top-4 right-1/3 w-2 h-2 bg-white/15 rounded-full animate-ping delay-300"
          style={{ animationDelay: "300ms" }}
        ></div>
        <div
          className="absolute -bottom-2 right-1/4 w-6 h-6 bg-white/10 rounded-full animate-pulse delay-500"
          style={{ animationDelay: "500ms" }}
        ></div>
        <div
          className="absolute bottom-20 left-10 w-4 h-4 bg-white/15 rounded-full animate-bounce delay-700"
          style={{ animationDelay: "700ms" }}
        ></div>
        <div
          className="absolute top-1/2 right-8 w-5 h-5 bg-white/10 rounded-full animate-ping delay-1000"
          style={{ animationDelay: "1000ms" }}
        ></div>
      </div>

      {/* Navigation Menu */}
      <div className="relative z-10 w-full">
        <h2 className="text-3xl font-bold mb-1 text-center border-b border-white/10 pb-4 tracking-wide bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
          Menu
        </h2>

        <nav className="flex flex-col gap-5 text-lg font-medium">
          <SidebarLink
            to="/app/network"
            icon={<Network size={20} />}
            label="My Network"
            current={location.pathname === "/app/network"}
          />
          <SidebarLink
            to="/app/post"
            icon={<PlusSquare size={20} />}
            label="Post"
            current={location.pathname === "/app/post"}
          />
          <SidebarLink
            to="/app/displayPosts"
            icon={<GoFileMedia size={20} />}
            label="Feed"
            current={location.pathname === "/app/displayPosts"}
          />
          <SidebarLink
            to="/app/Home"
            icon={<Users size={20} />}
            label="Connection"
            current={location.pathname === "/app/Home"}
          />

          <Link
            to="/app/notification"
            className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              location.pathname === "/app/notification"
                ? "bg-white/20 text-white font-semibold shadow-lg"
                : "text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-md"
            }`}
          >
            {location.pathname === "/app/notification" && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/30 to-violet-500/30 -z-10 animate-pulse"></div>
            )}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Heart icon with badge */}
            <div className="relative">
              <Heart className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />

                {notification?.length > 0 && (
                  <span className="absolute -top-3 -right-3 bg-gray-200 text-blue-700 text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                    {notification.length}
                  </span>
                )}
            </div>

            <span>Notification</span>
          </Link>

          <SidebarLink
            to="/app/profile"
            icon={<User size={20} />}
            label="Profile"
            current={location.pathname === "/app/profile"}
          />
        </nav>
      </div>
    </div>
  );
};

// 🧩 Reusable SidebarLink component
const SidebarLink = ({ to, icon, label, current }) => {
  return (
    <Link
      to={to}
      className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
        current
          ? "bg-white/20 text-white font-semibold shadow-lg"
          : "text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-md"
      }`}
    >
      {current && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/30 to-violet-500/30 -z-10 animate-pulse"></div>
      )}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="group-hover:rotate-12 transition-transform duration-300">
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
};

export default LeftSideBar;
