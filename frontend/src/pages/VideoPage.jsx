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
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  // Load token & user
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedToken) setToken(storedToken);
    if (storedUser) setUserId(storedUser._id);
  }, []);

  // Fetch video details
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

  // Fetch video & increment view count
  useEffect(() => {
    const load = async () => {
      await fetchVideo();
      try {
        await axiosInstance.put(`/videos/views/${id}`);
        fetchVideo();
      } catch {}
    };
    load();
  }, [id]);

  const handleLike = async () => {
    if (!token) return alert("Please login first");
    await axiosInstance.put(
      `/videos/like/${video._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchVideo();
  };

  const handleDislike = async () => {
    if (!token) return alert("Please login first");
    await axiosInstance.put(
      `/videos/dislike/${video._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchVideo();
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!video) return <p className="loading-text">Video not found</p>;

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

        {/* Like/Dislike */}
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

        {/* Channel */}
        <div className="channel-info">
          <img className="channel-avatar" src={channelAvatar} alt="" />
          <strong>{channelName}</strong>
        </div>

        {/* Comments */}
        <Comments videoId={video._id} token={token} />
      </div>
    </div>
  );
};

export default VideoPage;
