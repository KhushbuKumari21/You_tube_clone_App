// src/redux/videosSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Initial state for all videos
const initialState = {
  allVideos: [], // Store all videos fetched
  loading: false, // Loading state for API requests
  error: null, // Error message if fetching fails
};

// Create slice for videos
const videosSlice = createSlice({
  name: "videos", // Name of the slice
  initialState,
  reducers: {
    // Triggered when fetching all videos starts
    fetchAllStart: (state) => {
      state.loading = true;
    },
    // Triggered when fetching all videos is successful
    fetchAllSuccess: (state, action) => {
      state.loading = false;
      state.allVideos = action.payload; // Save fetched videos
    },
    // Triggered when fetching all videos fails
    fetchAllFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // Save error message
    },
  },
});

// Export actions
export const { fetchAllStart, fetchAllSuccess, fetchAllFailure } =
  videosSlice.actions;

// Export reducer to be used in store
export default videosSlice.reducer;
