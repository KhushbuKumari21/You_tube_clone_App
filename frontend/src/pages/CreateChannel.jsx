// src/pages/CreateChannel.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import "../styles/createChannel.css";

const CreateChannel = () => {
  const navigate = useNavigate();
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [channelBanner, setChannelBanner] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/signin");
  }, [navigate]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const res = await axiosInstance.post(
        "/channels",
        { channelName, description, channelBanner },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "Channel created successfully!");
      navigate(`/channel/${res.data.channel._id}`);
    } catch (err) {
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

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Coding tutorials and tech reviews by John Doe."
          />
        </label>

        <label>
          Channel Banner URL
          <input
            type="text"
            value={channelBanner}
            onChange={(e) => setChannelBanner(e.target.value)}
            placeholder="https://example.com/banners/john_banner.png"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Channel"}
        </button>
      </form>
    </div>
  );
};

export default CreateChannel;
