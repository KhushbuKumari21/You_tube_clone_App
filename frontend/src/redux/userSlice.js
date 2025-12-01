// src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Initial state for user slice
const initialState = {
  currentUser: null, // Stores the currently logged-in user
  loading: false,    // Tracks loading state during login/logout
  error: null,       // Stores any error during login/logout
};

const userSlice = createSlice({
  name: "user",       // Name of the slice
  initialState,       // Initial state defined above
  reducers: {
    // Action to start login process
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Action when login succeeds
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    // Action when login fails
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Action to logout the user
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions for dispatching
export const { loginStart, loginSuccess, loginFailure, logout } =
  userSlice.actions;

// Export reducer to configure store
export default userSlice.reducer;
