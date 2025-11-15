const jwt = require("jsonwebtoken");
const User = require("../models/User");

const validateToken = async (req, res, next) => {
    const header = req.header("Authorization");
    if (!header) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = header.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // full user details
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = validateToken;
