// src/pages/EditVideo.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";
import "../styles/editVideo.css";

const BASE_URL = "http://localhost:5000"; // Backend base URL (adjust if needed)

const EditVideo = () => {
  const { videoId } = useParams(); // Get videoId from URL
  const navigate = useNavigate();   // For programmatic navigation

  // State to hold video data fetched from backend
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    category: "",
    tags: [],
    videoUrl: "",
    thumbnailUrl: "",
  });

  const [loading, setLoading] = useState(true); // Loading state while fetching data

  // Redirect to /your-videos if no videoId is provided
  useEffect(() => {
    if (!videoId) {
      toast.error("Video ID missing!");
      navigate("/your-videos");
    }
  }, [videoId, navigate]);

  // Fetch video data from backend when component mounts or videoId changes
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axiosInstance.get(`/videos/find/${videoId}`);
        if (!res.data) throw new Error("Video not found");

        // Update state with fetched video data
        setVideoData({
          title: res.data.title || "",
          description: res.data.description || "",
          category: res.data.category || "",
          tags: res.data.tags || [],
          videoUrl: res.data.videoUrl || "",
          thumbnailUrl: res.data.thumbnailUrl || "",
        });
        setLoading(false); // Stop loading once data is fetched
      } catch (err) {
        console.error("Fetch video error:", err);
        toast.error(err.response?.data?.message || err.message);
        navigate("/your-videos"); // Redirect if error occurs
      }
    };

    if (videoId) fetchVideo();
  }, [videoId, navigate]);

  // Handle form input changes dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVideoData({ ...videoData, [name]: value });
  };

  // Handle video update form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!videoId) return toast.error("Cannot update: video ID missing");

    try {
      await axiosInstance.put(`/videos/${videoId}`, videoData); // Update video data in backend
      toast.success("Video updated successfully!");
      navigate("/your-videos"); // Navigate back to user's videos
    } catch (err) {
      console.error("Update video error:", err);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // Show loading text while video data is being fetched
  if (loading) return <p className="loading-text">Loading video data...</p>;

  return (
    <div className="edit-video-container">
      <h2>Edit Video</h2>
      <form className="edit-video-form" onSubmit={handleUpdate}>
        {/* Video title */}
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            name="title"
            id="title"
            value={videoData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Video description */}
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            id="description"
            value={videoData.description}
            onChange={handleChange}
          />
        </div>

        {/* Video category */}
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            name="category"
            id="category"
            value={videoData.category}
            onChange={handleChange}
          />
        </div>

        {/* Video URL */}
        <div className="form-group">
          <label htmlFor="videoUrl">Video URL:</label>
          <input
            type="text"
            name="videoUrl"
            id="videoUrl"
            value={videoData.videoUrl}
            onChange={handleChange}
            placeholder="/videos/example.mp4"
            required
          />
        </div>

        {/* Thumbnail URL */}
        <div className="form-group">
          <label htmlFor="thumbnailUrl">Thumbnail URL:</label>
          <input
            type="text"
            name="thumbnailUrl"
            id="thumbnailUrl"
            value={videoData.thumbnailUrl}
            onChange={handleChange}
            placeholder="/thumbnails/example.jpg"
          />
        </div>

        {/* Tags input */}
        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated):</label>
          <input
            type="text"
            name="tags"
            id="tags"
            value={videoData.tags.join(",")}
            onChange={(e) =>
              setVideoData({ ...videoData, tags: e.target.value.split(",") })
            }
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="update-btn">
          Update Video
        </button>
      </form>
    </div>
  );
};

export default EditVideo;
