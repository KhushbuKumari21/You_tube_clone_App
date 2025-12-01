// src/pages/LoginPage.jsx
import React, { useState } from "react";
import "../styles/login.css";
import axiosInstance from "../axiosInstance";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  // State for email and password inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Redux dispatch to update user state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // ------------------ VALIDATION ------------------
    // Check if email or password is empty
    if (!email || !password) {
      toast.error("Email and Password are required!", {
        position: "top-right",
        autoClose: 2000,
        transition: Slide,
      });
      return;
    }

    try {
      // ------------------ API CALL ------------------
      // Send POST request to backend /auth/signin
      const res = await axiosInstance.post("/auth/signin", { email, password });

      // ------------------ SAVE TOKEN & USER ------------------
      // Prepare user data with token
      const userData = {
        ...res.data.user,
        token: res.data.token, // attach token for future requests
      };

      // Save user data in localStorage for persistence
      localStorage.setItem("currentUser", JSON.stringify(userData));

      // Update Redux state with user info
      dispatch(loginSuccess(userData));

      // Show success message and redirect
      toast.success("Login successful! Redirecting...", {
        position: "top-right",
        autoClose: 1500,
        transition: Slide,
        onClose: () => navigate("/"),
      });
    } catch (err) {
      // Display error message on failed login
      toast.error(err.response?.data?.message || "Invalid credentials!", {
        position: "top-right",
        autoClose: 2000,
        transition: Slide,
      });
    }
  };

  return (
    <div className="auth-container">
      {/* Toast notifications */}
      <ToastContainer />

      {/* Login form */}
      <form className="google-card" onSubmit={handleLogin}>
        <h1 className="google-title">Sign in</h1>
       
        {/* Email input */}
        <input
          className="google-input"
          type="email"
          placeholder="Email or phone"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password input */}
        <input
          className="google-input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Submit button */}
        <button className="google-btn" type="submit">
          SignIn
        </button>

        {/* Link to sign up page */}
        <p className="google-link">
          <Link to="/signup">Create account</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
