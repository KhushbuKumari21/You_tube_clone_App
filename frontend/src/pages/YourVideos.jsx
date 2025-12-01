// src/pages/YourVideos.jsx
// This component displays all videos uploaded by the current user
// It allows fetching, displaying, and deleting user's own videos

import React, { useEffect, useState } from "react";
import api from "../axiosInstance"; // Axios instance for API calls
import { useSelector } from "react-redux"; // To get current user from Redux
import { toast } from "react-toastify"; // For toast notifications
import "../styles/yourVideos.css"; // Component-specific styles

const YourVideos = () => {
  const [videos, setVideos] = useState([]); // State to store user's videos
  const currentUser = useSelector((state) => state.user.currentUser); // Get logged-in user
  const userId = currentUser?._id; // Extract user ID

  // ------------------- FETCH USER'S VIDEOS -------------------
  const fetchYourVideos = async () => {
    try {
      const res = await api.get("/videos/your-videos"); // API call to get user's videos
      setVideos(res.data); // Set fetched videos to state
    } catch (err) {
      console.error("Error fetching your videos:", err);
    }
  };

  // Fetch videos when userId is available
  useEffect(() => {
    if (userId) fetchYourVideos();
  }, [userId]);

  // ------------------- DELETE VIDEO -------------------
  const handleDelete = async (videoId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?"
    );

    if (!confirmDelete) return; // Exit if user cancels

    try {
      await api.delete(`/videos/${videoId}`); // API call to delete video
      toast.success("Video deleted successfully!"); // Success notification

      // Refresh video list after deletion
      fetchYourVideos();
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Failed to delete video"); // Error notification
    }
  };

  return (
    <div className="your-videos-container">
      <h2>Your Uploaded Videos</h2>

      {videos.length === 0 ? (
        <p className="no-videos">You haven't uploaded any videos yet.</p> // Message if no videos
      ) : (
        <div className="videos-grid">
          {videos.map((video) => (
            <div key={video._id} className="video-card">
              {/* Thumbnail */}
              <img
                src={video.thumbnailUrl || "/default-thumbnail.png"}
                alt={video.title}
                className="video-thumbnail"
                onClick={() => (window.location.href = `/video/${video._id}`)} // Navigate to video page
              />

              {/* Video Info */}
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-channel">{video.channel?.channelName}</p>
                <p className="video-stats">
                  {video.views} views •{" "}
                  {new Date(video.uploadDate).toLocaleDateString()}
                </p>
              </div>

              {/* Delete Button */}
              <button
                className="delete-btn"
                onClick={() => handleDelete(video._id)} // Delete video on click
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourVideos;
