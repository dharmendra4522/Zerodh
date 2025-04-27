const User = require("../model/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = async (req, res, next) => {
    const token = req.cookies.token;
    console.log("Token recieved ", token);

    if(!token){
        console.log(res);
        return res.status(401).json({status: false, message: "No token Provided"});
    }

    jwt.verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
        if(err){
            console.error("JWT verification failed", err);
            
            return res.status(401).json({status: false, message: "Invalid  or Expired token"});

        }
        console.log("Decoded token", decoded);
        const user = await User.findById(decoded.id);
        console.log("currentUser", user);
        if(!user){
            return res.status(401).json({status: false, message: "User not found"});
        }

        req.userId = user._id;
        req.username = user.username;
        next();
    });
};