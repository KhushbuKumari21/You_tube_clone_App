// src/pages/ChannelPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import "../styles/channelPage.css";
import { FaBell, FaRegBell } from "react-icons/fa";

const ChannelPage = () => {
  const { id } = useParams(); // Get channel ID from URL
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null); // Store channel details
  const [loading, setLoading] = useState(true); // Loading state for async fetch
  const [subscribers, setSubscribers] = useState(0); // Track number of subscribers
  const [subscribed, setSubscribed] = useState(false); // Track if current user is subscribed

  // Redirect to signin page if user is not logged in
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/signin");
  }, [navigate]);

  // Fetch channel data from backend
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axiosInstance.get(`/channels/${id}`);
        setChannel(res.data);
        setSubscribers(res.data.subscribers?.length || 0);
        setLoading(false);
      } catch (err) {
        const status = err.response?.status;
        if (status === 404) {
          // Redirect to create channel page if channel not found
          navigate("/create-channel");
        } else {
          console.error(err.response?.data);
          setLoading(false);
        }
      }
    };
    if (id) fetchChannel();
  }, [id, navigate]);

  // Show loading message while fetching data
  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  if (!channel) return null; // Render nothing if no channel data

  // Handle subscribing to the channel
  const handleSubscribe = async () => {
    if (subscribed) return; // Do nothing if already subscribed
    setSubscribers(subscribers + 1); // Optimistic UI update
    setSubscribed(true);

    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post(
        `/channels/${id}/subscribe`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  return (
    <div className="channel-page">
      {/* Channel banner */}
      <img
        className="channel-banner"
        src={channel.channelBanner || "/avatars/kkimage.png"}
        alt="Banner"
      />

      {/* Channel header with avatar, name, description, subscribers */}
      <div className="channel-header">
        <div className="channel-header-left">
          <img
            src={channel.avatar || "/avatars/kkimage.png"}
            className="channel-avatar"
            alt="Avatar"
          />
          <div className="channel-info-text">
            <h1>{channel.channelName}</h1>
            <p>{channel.description}</p>
            <span>Subscribers: {subscribers}</span>
          </div>
        </div>

        {/* Subscribe button with bell icon */}
        <div className="channel-header-right">
          <button className="subscribe-btn" onClick={handleSubscribe}>
            {subscribed ? <FaBell /> : <FaRegBell />} Subscribe
          </button>

          {/** Upload button removed here */}
        </div>
      </div>

      {/* List of channel videos */}
      <h2>Videos</h2>
      <div className="video-list">
        {channel.videos.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : (
          channel.videos.map((video) => (
            <div key={video._id} className="video-card">
              <img src={video.thumbnail} alt={video.title} />
              <h4>{video.title}</h4>
              <p>
                {video.views} views • {new Date(video.uploadDate).toDateString()}
              </p>

              {/* Show edit/delete buttons only if current user is channel owner */}
              {channel.owner._id === localStorage.getItem("userId") && (
                <div className="video-actions">
                  <Link to={`/edit-video/${video._id}`}>
                    <button>Edit</button>
                  </Link>
                  <button
                    onClick={async () => {
                      if (window.confirm("Delete this video?")) {
                        const token = localStorage.getItem("token");
                        await axiosInstance.delete(`/videos/${video._id}`, {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        });
                        // Remove deleted video from local state
                        setChannel({
                          ...channel,
                          videos: channel.videos.filter(
                            (v) => v._id !== video._id
                          ),
                        });
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChannelPage;
