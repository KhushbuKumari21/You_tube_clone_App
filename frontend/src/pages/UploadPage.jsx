// src/pages/UploadPage.jsx
import React, { useState } from "react";
import Upload from "./Upload";
import VideoList from "../components/VideoList";

const UploadPage = () => {
  const [refresh, setRefresh] = useState(false);

  const handleUploadSuccess = () => setRefresh(prev => !prev);

  return (
    <div>
      <Upload onUploadSuccess={handleUploadSuccess} />
      <VideoList key={refresh} /> {/* refresh list after upload */}
    </div>
  );
};

export default UploadPage;
