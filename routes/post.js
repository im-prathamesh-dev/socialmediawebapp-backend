const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/authMiddleware");
const { createPost } = require("../controllers/postController");

router.post("/create", validateToken, createPost);

module.exports = router;
