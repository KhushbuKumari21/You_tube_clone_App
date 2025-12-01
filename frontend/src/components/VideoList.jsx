// src/components/VideoList.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/videoList.css";

const VideoList = () => {
  const [videos, setVideos] = useState([]); // Store fetched videos
  const navigate = useNavigate(); // Navigation hook

  // Fetch logged-in user's videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get("/videos/your-videos");
        setVideos(res.data); // Update state with fetched videos
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error(err.response?.data?.message || "Error fetching videos");
      }
    };
    fetchVideos();
  }, []);

  // Delete video
  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Video ID is undefined");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      console.log("Deleting video ID:", id);
      const res = await axiosInstance.delete(`/videos/${id}`);
      console.log("Delete response:", res.data);
      toast.success(res.data.message);
      setVideos(videos.filter((video) => video._id !== id)); // Remove deleted video from state
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Error deleting video");
    }
  };

  // Edit video
  const handleEdit = (id) => {
    if (!id) {
      toast.error("Video ID is undefined");
      return;
    }
    console.log("Navigating to edit video ID:", id);
    navigate(`/edit-video/${id}`); // Navigate to edit page
  };

  return (
    <div className="video-list">
      {videos.map((video) => (
        <div key={video._id} className="video-card">
          {/* Video thumbnail */}
          <img
            src={video.thumbnailUrl.replaceAll("\\", "/")}
            alt={video.title}
            className="video-thumbnail"
          />
          {/* Video title */}
          <h3 className="video-title">{video.title}</h3>

          {/* Edit and Delete buttons */}
          <div className="video-actions">
            <button className="edit-btn" onClick={() => handleEdit(video._id)}>
              Edit
            </button>
            <button
              className="delete-btn"
              onClick={() => handleDelete(video._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoList;
