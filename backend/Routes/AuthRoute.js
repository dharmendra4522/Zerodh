const { Signup, Login } = require("../controllers/AuthControllers");
const { Holding } = require("../controllers/Holding");
const router = require("express").Router();
const {userVerification } = require("../middlewares/AuthMiddleware");

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/", userVerification, (req, res) =>{
    res.json({
        status: true,
        user: req.username, //or username, depending on middleware
    });
});


module.exports = router;