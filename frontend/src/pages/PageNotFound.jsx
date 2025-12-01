// src/pages/PageNotFound.jsx
// This component displays a simple "Page Not Found" message with an image 
// and a link to navigate back to the home page.

import React from "react";
import { Link } from "react-router-dom";
import "../styles/pageNotFound.css";

const PageNotFound = () => {
  return (
    <div className="pnf-container">
      <div className="pnf-wrapper">
        {/* Image illustrating page not found */}
        <img
          className="pnf-image"
          src="https://cdn1.iconfinder.com/data/icons/photo-stickers-words/128/word_18-1024.png"
          alt="Page Not Found"
        />

        {/* Link to redirect user back to home page */}
        <Link to="/" className="pnf-title">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
