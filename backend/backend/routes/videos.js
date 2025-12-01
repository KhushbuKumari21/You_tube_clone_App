// routes/videos.js
import express from "express";
import Video from "../models/Video.js";
import Comment from "../models/Comment.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* =========================================================
   CREATE VIDEO
========================================================= */
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      tags,
      videoUrl,
      thumbnailUrl,
      channelId,
    } = req.body;

    if (!title || !videoUrl || !channelId) {
      return res
        .status(400)
        .json({ message: "title, videoUrl and channelId are required" });
    }

    const newVideo = await Video.create({
      uploader: req.user.id,
      channelId,
      title,
      description: description || "",
      category: category || "Other",
      tags: tags || [],
      videoUrl,
      thumbnailUrl: thumbnailUrl || "",
      views: 0,
      likes: [],
      dislikes: [],
      comments: [],
      uploadDate: new Date(),
    });

    res.status(201).json(newVideo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating video" });
  }
});

/* =========================================================
   GET ALL VIDEOS
========================================================= */
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().populate(
      "channelId",
      "channelName channelBanner"
    );

    res
      .status(200)
      .json(videos.map((v) => ({ ...v._doc, channel: v.channelId })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching videos" });
  }
});

/* =========================================================
   GET YOUR VIDEOS
========================================================= */
router.get("/your-videos", verifyToken, async (req, res) => {
  try {
    const videos = await Video.find({ uploader: req.user.id })
      .populate("channelId", "channelName channelBanner")
      .sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching your videos" });
  }
});

/* =========================================================
   GET VIDEO BY ID
========================================================= */
router.get("/find/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate(
      "channelId",
      "channelName channelBanner"
    );

    if (!video)
      return res.status(404).json({ message: "Video not found" });

    res.status(200).json({ ...video._doc, channel: video.channelId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching video" });
  }
});

/* =========================================================
   SEARCH VIDEOS
========================================================= */
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q)
      return res.status(400).json({ message: "Search query missing" });

    const videos = await Video.find({
      title: { $regex: q, $options: "i" },
    }).populate("channelId", "channelName channelBanner");

    res
      .status(200)
      .json(videos.map((v) => ({ ...v._doc, channel: v.channelId })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server search error" });
  }
});

/* =========================================================
   GET VIDEOS BY TAG
========================================================= */
router.get("/tag/:tag", async (req, res) => {
  try {
    const videos = await Video.find({ tags: req.params.tag }).populate(
      "channelId",
      "channelName channelBanner"
    );

    res
      .status(200)
      .json(videos.map((v) => ({ ...v._doc, channel: v.channelId })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching videos by tag" });
  }
});

/* =========================================================
   LIKE VIDEO
========================================================= */
router.put("/like/:id", verifyToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video)
      return res.status(404).json({ message: "Video not found" });

    const userId = req.user.id;

    if (!video.likes.includes(userId)) {
      video.likes.push(userId);
      video.dislikes = video.dislikes.filter((d) => d.toString() !== userId);
    } else {
      video.likes = video.likes.filter((l) => l.toString() !== userId);
    }

    await video.save();
    res.status(200).json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error liking video" });
  }
});

/* =========================================================
   DISLIKE VIDEO
========================================================= */
router.put("/dislike/:id", verifyToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video)
      return res.status(404).json({ message: "Video not found" });

    const userId = req.user.id;

    if (!video.dislikes.includes(userId)) {
      video.dislikes.push(userId);
      video.likes = video.likes.filter((l) => l.toString() !== userId);
    } else {
      video.dislikes = video.dislikes.filter((d) => d.toString() !== userId);
    }

    await video.save();
    res.status(200).json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error disliking video" });
  }
});

/* =========================================================
   INCREMENT VIEWS
========================================================= */
router.put("/views/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video)
      return res.status(404).json({ message: "Video not found" });

    video.views += 1;
    await video.save();

    res.status(200).json({ views: video.views });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error incrementing views" });
  }
});

/* =========================================================
   UPDATE VIDEO  (KEEP BEFORE COMMENT)
========================================================= */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video)
      return res.status(404).json({ message: "Video not found" });

    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to update this video",
      });
    }

    const updated = await Video.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating video" });
  }
});

/* =========================================================
   DELETE VIDEO
========================================================= */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video)
      return res.status(404).json({ message: "Video not found" });

    if (video.uploader.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this video" });
    }

    await video.deleteOne();
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   ADD COMMENT  (KEEP AT END)
========================================================= */
router.put("/:id/comment", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text)
      return res.status(400).json({ message: "Comment text required" });

    const video = await Video.findById(req.params.id);
    if (!video)
      return res.status(404).json({ message: "Video not found" });

    const newComment = await Comment.create({
      text,
      video: video._id,
      user: req.user.id,
    });

    video.comments.push(newComment._id);
    await video.save();

    const populated = await Comment.findById(newComment._id).populate(
      "user",
      "username img"
    );

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding comment" });
  }
});

export default router;
