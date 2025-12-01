// src/redux/videoSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Initial state for video slice
const initialState = {
  currentVideo: null, // Stores the currently selected video
  loading: false,     // Tracks loading state for async operations
  error: null,        // Stores any error messages
};

// Create video slice
const videoSlice = createSlice({
  name: "video",        // Name of the slice
  initialState,         // Set initial state
  reducers: {
    // Triggered when fetching a video starts
    fetchVideoStart: (state) => {
      state.loading = true;
    },
    // Triggered when fetching a video succeeds
    fetchVideoSuccess: (state, action) => {
      state.loading = false;
      state.currentVideo = action.payload;
    },
    // Triggered when fetching a video fails
    fetchVideoFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Handle liking a video
    like: (state, action) => {
      if (!state.currentVideo.likes.includes(action.payload)) {
        state.currentVideo.likes.push(action.payload);
        // Remove from dislikes if present
        state.currentVideo.dislikes = state.currentVideo.dislikes.filter(
          (id) => id !== action.payload
        );
      }
    },
    // Handle disliking a video
    dislike: (state, action) => {
      if (!state.currentVideo.dislikes.includes(action.payload)) {
        state.currentVideo.dislikes.push(action.payload);
        // Remove from likes if present
        state.currentVideo.likes = state.currentVideo.likes.filter(
          (id) => id !== action.payload
        );
      }
    },
    // Optional: update current video info
    updateVideo: (state, action) => {
      state.currentVideo = action.payload;
    },
  },
});

// Export actions for use in components
export const {
  fetchVideoStart,
  fetchVideoSuccess,
  fetchVideoFailure,
  like,
  dislike,
  updateVideo,
} = videoSlice.actions;

// Export reducer for store
export default videoSlice.reducer;
