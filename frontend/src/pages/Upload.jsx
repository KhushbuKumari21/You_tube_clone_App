// src/pages/UploadVideo.jsx
// This component handles the uploading of a new video by the user.
// It includes input fields for title, description, video URL, thumbnail URL, and tags.
// Uses axiosInstance to send a POST request to the backend.
// Shows success/error messages using react-toastify.

import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadVideo = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState(""); // video title
  const [description, setDescription] = useState(""); // video description
  const [videoUrl, setVideoUrl] = useState(""); // video URL
  const [thumbnailUrl, setThumbnailUrl] = useState(""); // thumbnail URL
  const [tags, setTags] = useState(""); // comma separated tags

  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  const channelId = user?.channels?.[0]; // first channel
  const token = user?.token; // user token for authorization

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
      tags: tags ? tags.split(",").map((t) => t.trim()) : [], // split and trim tags
    };

    try {
      const res = await axiosInstance.post("/videos", payload, {
        headers: {
          Authorization: `Bearer ${token}`, // attach token in header
        },
      });

      toast.success("Video uploaded successfully!");
      if (onUploadSuccess) onUploadSuccess(res.data); // notify parent component

      // Reset form after successful upload
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setThumbnailUrl("");
      setTags("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed!"); // show error
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>Upload Video</h2>
      <form onSubmit={handleUpload}>
        {/* Video Title Input */}
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        {/* Video Description Input */}
        <textarea
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        {/* Video URL Input */}
        <input
          type="text"
          placeholder="Video URL (e.g., /videos/shiv-parvati-vivah.mp4)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        {/* Thumbnail URL Input */}
        <input
          type="text"
          placeholder="Thumbnail URL (e.g., /thumbnails/download.jpg)"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        {/* Tags Input */}
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        {/* Submit Button */}
        <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadVideo;
