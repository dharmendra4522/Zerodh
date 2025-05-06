const User = require("../model/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
//new
const SECRET = process.env.JWT_SECRET;

module.exports.userVerification = async (req, res, next) => {
  const token = req.cookies.token;

  console.log("Token received:", token);

  if (!token) {
    return res.status(401).json({ status: false, message: "No token provided" });
  }
  console.log("Value of process.env.JWT_SECRET:", process.env.JWT_SECRET);

  // Verifying token
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      // console.error("JWT verification failed:", err);
      console.error("JWT verification failed:", err);
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        console.log("Attempted decoded token (even though there was an error):", decoded); // Log the decoded object even if there was an error
      return res.status(403).json({ status: false, message: "Invalid or expired token" });
    }

    console.log("Decoded token:", decoded);

    try {
      const user = await User.findById(decoded.id);
      // console.log("Current User:", user);
      console.log("Current User:", !!user);

      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }

      req.userId = user._id;
      req.username = user.username;

      next(); // Proceed to the next middleware
    } catch (error) {
      console.error("Error finding user:", error);
      return res.status(500).json({ status: false, message: "Server error" });
    }
  });
};
