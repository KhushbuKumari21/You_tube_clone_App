// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VideoCard from "../components/VideoCard";
import axiosInstance from "../axiosInstance";
import { fetchAllSuccess } from "../redux/videosSlice";
import "../styles/home.css";

// Default tags for filtering
const DEFAULT_TAGS = [
  "All", "Music", "Gaming", "Programming", "Tech", "Sports","Story",
  "Religious", "News", "Comedy", "Movies"
];

// Sample fallback data
const sampleData = [
  {
    videoId: "video01",
    title: "Learn React in 30 Minutes",
    thumbnailUrl: "https://example.com/thumbnails/react30min.png",
    description: "Quick tutorial to start React.",
    channelId: "channel01",
    channelName: "Code Academy",
    uploader: "user01",
    views: 15200,
    likes: 1023,
    uploadDate: "2024-09-20",
  },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const { allVideos } = useSelector((state) => state.videos); // Get all videos from redux store
  const { currentUser } = useSelector((state) => state.user); // Get current logged-in user

  const [activeTag, setActiveTag] = useState("All"); // Current active filter tag
  const [tags] = useState(DEFAULT_TAGS); // List of available tags
  const [loading, setLoading] = useState(true); // Loading state
  const [err, setErr] = useState(""); // Error message

  // Fetch videos from backend on component mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get("/videos"); // API call to get videos
        const videosArray = Array.isArray(res.data) ? res.data : [res.data];
        // Dispatch fetched videos to redux store, fallback to sampleData if empty
        dispatch(fetchAllSuccess(videosArray.length ? videosArray : sampleData));
      } catch (error) {
        setErr("Failed to fetch videos."); // Set error if fetch fails
        dispatch(fetchAllSuccess(sampleData)); // Fallback to sample data
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchVideos();
  }, [dispatch]);

  // Filter videos based on active tag
  const filteredVideos = allVideos
    .filter((v) => v.channelName || v.channel?.channelName)
    .filter((v) => activeTag === "All" || v.tags?.includes(activeTag));

  // If user is not logged in
  if (!currentUser) {
    return (
      <div className="home-container">
        <h2>Please Login to Continue</h2>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* FILTER BUTTONS */}
      <div className="filter-buttons">
        {tags.map((tag) => (
          <button
            key={tag}
            className={activeTag === tag ? "active-filter" : ""}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* LOADING / ERROR */}
      {loading && <p className="loading">Loading videos…</p>}
      {!loading && err && <p className="error">{err}</p>}

      {/* VIDEO GRID */}
      <div className="videos-container">
        {!loading && filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <VideoCard key={video.videoId || video._id} video={video} />
          ))
        ) : (
          !loading && <p>No videos found.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
