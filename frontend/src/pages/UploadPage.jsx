// src/pages/UploadPage.jsx
import React, { useState } from "react";
import Upload from "./Upload";
import VideoList from "../components/VideoList";

const UploadPage = () => {
  // State to trigger re-render of VideoList after a successful upload
  const [refresh, setRefresh] = useState(false);

  // Callback function passed to Upload component, toggles refresh state
  const handleUploadSuccess = () => setRefresh(prev => !prev);

  return (
    <div>
      {/* Upload component handles the video upload */}
      <Upload onUploadSuccess={handleUploadSuccess} />
      
      {/* VideoList component displays videos, key changes trigger re-render */}
      <VideoList key={refresh} /> {/* refresh list after upload */}
    </div>
  );
};

export default UploadPage;
