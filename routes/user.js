const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/authMiddleware");
const Post = require("../models/Post");

router.get("/user", validateToken, (req, res) => {
    // console.log("Fetched User Info:","user name:", req.user.name, "email:", req.user.email);
    res.status(200).json({
        message: "User info fetched successfully",
        user: req.user   // full user details
    });


});
router.get("/posts", validateToken, async (req, res) => {
    try {
        // Fetch posts of the logged-in user
        const posts = await Post.find({ userId: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Posts fetched successfully",
            totalPosts: posts.length,
            posts
        });

    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
