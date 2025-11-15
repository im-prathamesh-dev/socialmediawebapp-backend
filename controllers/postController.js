const Post = require("../models/Post");

exports.createPost = async (req, res) => {
    try {
        const { content, image } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Post content is required" });
        }

        // req.user is coming from auth middleware
        const newPost = await Post.create({
            userId: req.user._id,
            content,
            image: image || null
        });

        res.status(201).json({
            message: "Post created successfully",
            post: newPost
        });

    } catch (error) {
        console.error("Create Post Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
