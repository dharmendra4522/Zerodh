const User = require("../model/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
//new
const SECRET = process.env.JWT_SECRET;

module.exports.userVerification = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("Invalid or missing Authorization header");
      return res.status(401).json({ 
        status: false, 
        message: "Invalid authorization header" 
      });
    }

    const token = authHeader.split(' ')[1];
    console.log("Token extracted:", token);

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ 
        status: false, 
        message: "No token provided" 
      });
    }

    // Verifying token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.id);
    console.log("User found:", !!user);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ 
        status: false, 
        message: "User not found" 
      });
    }

    // Attach user info to request
    req.userId = user._id;
    req.username = user.username;

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(403).json({ 
      status: false, 
      message: "Invalid or expired token" 
    });
  }
};
