// src/pages/YourVideos.jsx
import React, { useEffect, useState } from "react";
import api from "../axiosInstance";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../styles/yourVideos.css";

const YourVideos = () => {
  const [videos, setVideos] = useState([]);
  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?._id;

  // Fetch user's videos
  const fetchYourVideos = async () => {
    try {
      const res = await api.get("/videos/your-videos");
      setVideos(res.data);
    } catch (err) {
      console.error("Error fetching your videos:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchYourVideos();
  }, [userId]);

  // DELETE VIDEO
  const handleDelete = async (videoId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/videos/${videoId}`);
      toast.success("Video deleted successfully!");

      // Refresh video list
      fetchYourVideos();
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Failed to delete video");
    }
  };

  return (
    <div className="your-videos-container">
      <h2>Your Uploaded Videos</h2>

      {videos.length === 0 ? (
        <p className="no-videos">You haven't uploaded any videos yet.</p>
      ) : (
        <div className="videos-grid">
          {videos.map((video) => (
            <div key={video._id} className="video-card">
              {/* Thumbnail */}
              <img
                src={video.thumbnailUrl || "/default-thumbnail.png"}
                alt={video.title}
                className="video-thumbnail"
                onClick={() => (window.location.href = `/video/${video._id}`)}
              />

              {/* Info */}
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
                onClick={() => handleDelete(video._id)}
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
