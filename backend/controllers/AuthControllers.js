const User = require("../model/UserModel");
const { createSecret } = require("../utils/ScretToken");
const bcrypt = require("bcrypt");

module.exports.Signup = async (req, res, next) => {
    try {
        const { email, password, username, createdAt } = req.body;

        if (!email || !password || !username) {
            return res.json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }

        const user = await User.create({ email, password, username, createdAt });

        const token = createSecret(user._id);

        // Secure cookie handling
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure cookie for production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Cross-origin in production
        });

        res.status(201).json({ message: "User signed up successfully", success: true, user });
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error during signup", success: false });
    }
};

module.exports.Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ message: 'Incorrect email or password' });
        }

        const auth = await bcrypt.compare(password, user.password);

        if (!auth) {
            return res.json({ message: 'Incorrect email or password' });
        }

        const token = createSecretToken(user._id);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure cookies only in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Allow cross-origin only in production
        };

        res.cookie('token', token, cookieOptions);
        res.status(200).json({ message: "User logged in successfully", success: true });
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error during login", success: false });
    }
};
