// src/pages/UploadVideo.jsx
import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadVideo = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [tags, setTags] = useState("");

  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  const channelId = user?.channels?.[0]; // first channel
  const token = user?.token;

  const handleUpload = async (e) => {
    e.preventDefault();

    // Validations
    if (!channelId) return toast.error("You need to create a channel first!");
    if (!title || !videoUrl) return toast.error("Title and Video URL are required!");

    const payload = {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      channelId,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
    };

    try {
      const res = await axiosInstance.post("/videos", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Video uploaded successfully!");
      if (onUploadSuccess) onUploadSuccess(res.data);

      // Reset form
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setThumbnailUrl("");
      setTags("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed!");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>Upload Video</h2>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <textarea
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Video URL (e.g., /videos/shiv-parvati-vivah.mp4)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Thumbnail URL (e.g., /thumbnails/download.jpg)"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadVideo;
