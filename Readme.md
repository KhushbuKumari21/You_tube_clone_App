# YouTube Clone – Full Stack Project (MERN)

📌## Project Summary

A fully functional YouTube-like video streaming platform built using Node.js, Express, MongoDB, React.js, Redux, and JWT Authentication.
Users can watch videos, upload videos, delete videos, edit videos, like/dislike videos, and manage comments (post, edit, delete).
The platform supports search, category-based filtering, and allows users to create and manage their own channels—just like YouTube.

🚀 ## Tech Stack

### Frontend

React.js (Vite)
Redux Toolkit
React Router DOM
Axios
React Player
CSS

### Backend

Node.js
Express.js
MongoDB + Mongoose ORM
JWT Authentication
Bcrypt Password Hashing

📌 Features
🔐 Authentication
User Sign Up & Login
JWT-based authentication
Password hashing using bcrypt
Removes password before sending response

👤 User
Can create an account and log in
Receives a JWT token after login for secure access
Can create/manage their own channel
Can upload, edit, and delete their videos
Can like/dislike videos and post/edit/delete comments
User profile is linked to their channel, videos, and activity

📺 Channels
Users can create their own channel
Channel owner can update or delete the channel
Channels are linked to the User model
Each channel displays all videos uploaded by the owner
Automatically shows videos uploaded after the channel is created
Users can manage their channel’s content from the channel dashboard

🎥 Videos
Upload videos
Edit/Delete only own videos
Like/Dislike feature
Increase view count
Filter videos by tags
Filter videos by search query

💬 Comments
Add comment
Edit/Delete own comments
Comments populated with user info

🔍 Filtering & Search
Search bar to filter by title
Category wise filter tags
Homepage with all videos

📱 Fully Responsive
Works on mobile, tablet, desktop

🗂 Project Structure
Backend Structure
backend/
│── config/
│ └── db.js # MongoDB connection file
│
│── controllers/
│ ├── authController.js # Signup, login, JWT generation
│ ├── channelController.js # Channel CRUD operations
│ ├── commentController.js # Comment CRUD operations
│ └── videoController.js # Video upload, edit, delete, like/dislike
│
│── middleware/
│ └── verifyToken.js # JWT authentication middleware
│
│── models/
│ ├── User.js # User schema
│ ├── Channel.js # Channel schema
│ ├── Video.js # Video schema
│ └── Comment.js # Comments schema
│
│── routes/
│ ├── auth.js # Auth routes
│ ├── channels.js # Channel routes
│ ├── comments.js # Comment routes
│ └── videos.js # Video routes
│
│── utils/
│ └── generateToken.js # JWT token creator
│
│── server.js # Main entry point
│── .env # Environment variables
│── package.json # Backend dependencies & scripts

Frontend Structure
frontend/
│── .env
│── index.html
│── package.json
│── vite.config.js
│
│── public/
│ ├── avatars/
│ ├── thumbnails/
│ └── videos/
│
└── src/
├── App.jsx
├── main.jsx
├── axiosInstance.js
├── firebase.js
│
├── assets/
├── components/
├── constants/
├── data/
├── helper/
├── pages/
├── redux/
└── styles/

⚙️\***\* # # Backend Setup & Run\*\***

1. Go to backend folder
   cd backend

2. Install dependencies
   npm install

3. Create .env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key

4. Start backend

### npm start

If successful, you will see:

# Server running on port 5000

MongoDB connected

Base URL
http://localhost:5000/api

⚙️ **# Frontend Setup & Run**

1. Go to frontend
   cd frontend

2. Install dependencies
   npm install

3. Create .env
   VITE_API_URL=http://localhost:5000

4. Start frontend

### npm run dev

Open:

# http://localhost:5173

🔄 Complete App Flow

1️⃣ User Registration
User signs up
Data stored in DB
2️⃣ Login
User logs in
JWT token generated
Token saved in localStorage

3️⃣ Home Page Loads
All videos shown
User can search or filter by tags or title

4️⃣ Video Page
User can:
Watch video
Like & Dislike
Add/Edit/Delete comment(own comment)
View channel

5️⃣ Create Channel
User provides:
Channel name
Description
Banner

6️⃣ Upload Videos
Upload includes:
Video file
Thumbnail url
video url
Title
Description
Tags

7️⃣ Manage Videos
User can update own video
User can delete own video

📁 **Output Folder**
C:\Users\Khushbu\Downloads\App\backend\backend output\OUTPUT

🔗 **Important Links**
GitHub Repo
👉 Backend + Frontend:
https://github.com/KhushbuKumari21/You_tube_clone_App

Project Explanation Video
👉 https://drive.google.com/file/d/1IvDO5zuVAoPYbVJrqLFOuFsZgdf5nuUp/view?usp=sharing

https://drive.google.com/file/d/1IvDO5zuVAoPYbVJrqLFOuFsZgdf5nuUp/view?usp=sharing

🎉 Conclusion
This YouTube Clone project demonstrates a complete MERN stack application with:
JWT Authentication for secure login (token generated after login)
User Features: create account, sign in/out, manage own profile
Channel Management: create channel, update/delete channel, upload videos to own channel
Video System: upload, edit, delete own videos, view all videos on Home Page, filter by search (title) or tags

Engagement Features: like/dislike videos, add/edit/delete own comments
Fully responsive UI built with React, Redux, and modern design principles