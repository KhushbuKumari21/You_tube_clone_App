// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import api from "../axiosInstance";
import "../styles/sidebar.css";

// Icons
import { IoHomeSharp } from "react-icons/io5";
import {
  MdOutlineSubscriptions,
  MdOutlineWatchLater,
  MdOutlineVideoLibrary,
  MdLogout,
} from "react-icons/md";
import { BiLike } from "react-icons/bi";
import { TbMusic } from "react-icons/tb";
import { PiFireLight } from "react-icons/pi";
import { FaUpload } from "react-icons/fa6"; // Upload icon

const Sidebar = ({ sidebarOpen, setSidebarOpen, darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?._id;

  const [userChannel, setUserChannel] = useState(null);

  // Fetch user channel
  useEffect(() => {
    const fetchUserChannel = async () => {
      if (!userId) return;
      try {
        const res = await api.get(`/channels/find/${userId}`);
        setUserChannel(res.data);
      } catch (err) {
        if (err.response?.status === 404) setUserChannel(null);
      }
    };
    fetchUserChannel();
  }, [userId]);

  const activeTab = location.pathname.includes("/trending")
    ? "Trending"
    : location.pathname.includes("/subscriptions")
    ? "Subscriptions"
    : location.pathname.includes("/your-videos")
    ? "YourVideos"
    : location.pathname.includes("/watchlater")
    ? "WatchLater"
    : location.pathname.includes("/liked")
    ? "Liked"
    : location.pathname.includes("/music")
    ? "Music"
    : "Home";

  const logOut = () => {
    localStorage.removeItem("currentUser");
    dispatch(logout());
    navigate("/signin");
  };

  const goToPage = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className={`sidebar-overlay show`}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`sidebar-container ${sidebarOpen ? "open" : ""} ${
          darkMode ? "dark" : ""
        }`}
      >
        {/* Scrollable content */}
        <div className="sidebar-section-wrapper">

          {/* FIRST BLOCK */}
          <div className="sidebar-section-block">
            <div
              className={`sidebar-item ${activeTab === "Home" ? "active" : ""}`}
              onClick={() => goToPage("/")}
            >
              <IoHomeSharp /> Home
            </div>

            <div
              className={`sidebar-item ${activeTab === "Trending" ? "active" : ""}`}
              onClick={() => goToPage("/trending")}
            >
              <PiFireLight /> Shorts
            </div>

            <div
              className={`sidebar-item ${activeTab === "Subscriptions" ? "active" : ""}`}
              onClick={() => goToPage("/subscriptions")}
            >
              <MdOutlineSubscriptions /> Subscriptions
            </div>
          </div>

          <div className="sidebar-section-divider"></div>

          {/* SECOND BLOCK */}
          <div className="sidebar-section-block">
            <p className="sidebar-section-title">You</p>

            {/* Your Videos Link */}
            <div
              className={`sidebar-item ${activeTab === "YourVideos" ? "active" : ""}`}
              onClick={() => goToPage("/your-videos")}
            >
              <MdOutlineVideoLibrary /> Your Videos
            </div>

            {currentUser && userChannel ? (
              <>
                <div
                  className="sidebar-item"
                  onClick={() => navigate(`/channel/${userChannel._id}`)}
                >
                  <MdOutlineVideoLibrary /> Your Channel
                </div>

                <div
                  className="sidebar-item"
                  onClick={() => navigate("/upload")}
                >
                  <FaUpload /> Upload Video
                </div>
              </>
            ) : currentUser ? (
              <div
                className="sidebar-item create-channel-btn"
                onClick={() => navigate("/create-channel")}
              >
                + Create Channel
              </div>
            ) : null}

            <div
              className={`sidebar-item ${activeTab === "WatchLater" ? "active" : ""}`}
              onClick={() => goToPage("/watchlater")}
            >
              <MdOutlineWatchLater /> Watch Later
            </div>

            <div
              className={`sidebar-item ${activeTab === "Liked" ? "active" : ""}`}
              onClick={() => goToPage("/liked")}
            >
              <BiLike /> Liked Videos
            </div>
          </div>

          <div className="sidebar-section-divider"></div>

          {/* THIRD BLOCK */}
          <div className="sidebar-section-block">
            <div
              className={`sidebar-item ${activeTab === "Music" ? "active" : ""}`}
              onClick={() => goToPage("/music")}
            >
              <TbMusic /> Music
            </div>
          </div>

          <div className="sidebar-section-divider"></div>

          {/* SIGN-IN / LOGOUT */}
          <div className="sidebar-section-block">
            {currentUser ? (
              <div className="sidebar-item" onClick={logOut}>
                <MdLogout /> Sign Out
              </div>
            ) : (
              <div className="sidebar-login-box">
                <p>Sign in to like videos, comment & subscribe</p>
                <button onClick={() => goToPage("/signin")} className="signin-btn">
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER FIXED */}
        <div className="sidebar-footer">
          <a
            href="https://github.com/KhushbuKumari21"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
