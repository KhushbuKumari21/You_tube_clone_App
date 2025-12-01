// src/pages/VideoPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import "../styles/video.css";
import Comments from "../components/comments";
import { format } from "timeago.js";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike,
} from "react-icons/ai";

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null); // state for video data
  const [loading, setLoading] = useState(true); // state for loading status
  const [token, setToken] = useState(""); // state to store JWT token
  const [userId, setUserId] = useState(""); // state to store user ID

  // Load token & user from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedToken) setToken(storedToken);
    if (storedUser) setUserId(storedUser._id);
  }, []);

  // Fetch video details from backend
  const fetchVideo = async () => {
    try {
      const res = await axiosInstance.get(`/videos/find/${id}`);
      setVideo(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch video & increment view count on mount
  useEffect(() => {
    const load = async () => {
      await fetchVideo();
      try {
        await axiosInstance.put(`/videos/views/${id}`); // increment views
        fetchVideo(); // refresh video data
      } catch {}
    };
    load();
  }, [id]);

  // Handle like action
  const handleLike = async () => {
    if (!token) return alert("Please login first");
    await axiosInstance.put(
      `/videos/like/${video._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchVideo(); // refresh video data
  };

  // Handle dislike action
  const handleDislike = async () => {
    if (!token) return alert("Please login first");
    await axiosInstance.put(
      `/videos/dislike/${video._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchVideo(); // refresh video data
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!video) return <p className="loading-text">Video not found</p>;

  // Format upload time
  const uploadTime = video.uploadDate ? format(video.uploadDate) : "Unknown";
  const channelName = video.channel?.channelName || "Unknown Channel";
  const channelAvatar = video.channel?.avatar || "/avatars/kkimage.png";

  return (
    <div className="video-container">
      <div className="video-wrapper">
        {/* Video Player */}
        <video className="video-frame" src={video.videoUrl} controls />

        {/* Title */}
        <h2 className="video-title">{video.title}</h2>

        {/* Info */}
        <div className="video-info">
          {video.views.toLocaleString()} views • {uploadTime}
        </div>

        {/* Like/Dislike Buttons */}
        <div className="video-actions">
          <button onClick={handleLike}>
            {video.likes.includes(userId) ? <AiFillLike /> : <AiOutlineLike />}
            {video.likes.length}
          </button>
          <button onClick={handleDislike}>
            {video.dislikes.includes(userId) ? (
              <AiFillDislike />
            ) : (
              <AiOutlineDislike />
            )}
            {video.dislikes.length}
          </button>
        </div>

        {/* Description */}
        <p className="video-description">{video.description}</p>

        {/* Channel Info */}
        <div className="channel-info">
          <img className="channel-avatar" src={channelAvatar} alt="" />
          <strong>{channelName}</strong>
        </div>

        {/* Comments Section */}
        <Comments videoId={video._id} token={token} />
      </div>
    </div>
  );
};

export default VideoPage;
