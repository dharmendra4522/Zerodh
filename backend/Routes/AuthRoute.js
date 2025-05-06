const { Signup, Login, Logout } = require("../controllers/AuthControllers");
const { Holding } = require("../controllers/Holding");
const router = require("express").Router();
const {userVerification } = require("../middlewares/AuthMiddleware");
const User = require("../model/UserModel");

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", userVerification, Logout);
router.get("/", userVerification, async (req, res) =>{
    try {
        console.log('Fetching user data for ID:', req.userId);
        const user = await User.findById(req.userId);
        console.log(
            'Found user:', user);
        
        if (!user) {
            console.log('User not found');
            return res.json({ status: false, message: "User not found" });
        }
        
        const userData = {
            username: user.username,
            email: user.email
        };
        console.log('Sending user data:', userData);
        
        res.json({
            status: true,
            user: userData
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.json({ status: false, message: "Error fetching user data" });
    }
});

module.exports = router;