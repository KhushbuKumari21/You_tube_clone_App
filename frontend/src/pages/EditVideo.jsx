import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";
import "../styles/editVideo.css";

const BASE_URL = "http://localhost:5000"; // adjust based on your backend

const EditVideo = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    category: "",
    tags: [],
    videoUrl: "",
    thumbnailUrl: "",
  });
  const [loading, setLoading] = useState(true);

  // Redirect if no videoId
  useEffect(() => {
    if (!videoId) {
      toast.error("Video ID missing!");
      navigate("/your-videos");
    }
  }, [videoId, navigate]);

  // Fetch video data
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axiosInstance.get(`/videos/find/${videoId}`);
        if (!res.data) throw new Error("Video not found");

        setVideoData({
          title: res.data.title || "",
          description: res.data.description || "",
          category: res.data.category || "",
          tags: res.data.tags || [],
          videoUrl: res.data.videoUrl || "",
          thumbnailUrl: res.data.thumbnailUrl || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Fetch video error:", err);
        toast.error(err.response?.data?.message || err.message);
        navigate("/your-videos");
      }
    };
    if (videoId) fetchVideo();
  }, [videoId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVideoData({ ...videoData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!videoId) return toast.error("Cannot update: video ID missing");

    try {
      await axiosInstance.put(`/videos/${videoId}`, videoData);
      toast.success("Video updated successfully!");
      navigate("/your-videos");
    } catch (err) {
      console.error("Update video error:", err);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <p className="loading-text">Loading video data...</p>;

  return (
    <div className="edit-video-container">
      <h2>Edit Video</h2>
      <form className="edit-video-form" onSubmit={handleUpdate}>
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

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            id="description"
            value={videoData.description}
            onChange={handleChange}
          />
        </div>

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

        <button type="submit" className="update-btn">
          Update Video
        </button>
      </form>
    </div>
  );
};

export default EditVideo;
