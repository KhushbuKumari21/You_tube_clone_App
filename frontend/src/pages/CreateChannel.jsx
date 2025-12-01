// src/pages/CreateChannel.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance"; // Axios instance for API calls
import "../styles/createChannel.css";

const CreateChannel = () => {
  const navigate = useNavigate(); // Navigation hook
  const [channelName, setChannelName] = useState(""); // State for channel name
  const [description, setDescription] = useState(""); // State for description
  const [channelBanner, setChannelBanner] = useState(""); // State for banner URL
  const [loading, setLoading] = useState(false); // Loading state while creating channel

  // Redirect user to sign-in if not logged in
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/signin");
  }, [navigate]);

  // Function to handle channel creation
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token"); // Get JWT token from localStorage

    try {
      // Send POST request to create a channel
      const res = await axiosInstance.post(
        "/channels",
        { channelName, description, channelBanner },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Show success message and navigate to created channel page
      alert(res.data.message || "Channel created successfully!");
      navigate(`/channel/${res.data.channel._id}`);
    } catch (err) {
      // Handle errors
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Failed to create channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-channel-page">
      <h2>Create Your Channel</h2>
      <form onSubmit={handleCreate} className="create-channel-form">
        {/* Input for Channel Name */}
        <label>
          Channel Name*
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="e.g. Code with John"
            required
          />
        </label>

        {/* Input for Description */}
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Coding tutorials and tech reviews by John Doe."
          />
        </label>

        {/* Input for Channel Banner URL */}
        <label>
          Channel Banner URL
          <input
            type="text"
            value={channelBanner}
            onChange={(e) => setChannelBanner(e.target.value)}
            placeholder="https://example.com/banners/john_banner.png"
          />
        </label>

        {/* Submit button */}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Channel"}
        </button>
      </form>
    </div>
  );
};

export default CreateChannel;
