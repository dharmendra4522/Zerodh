const User = require("../model/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Signup = async (req, res, next) => {
    try {
        const { email, password, username, createdAt } = req.body;

        console.log("Received data:", req.body);

        if (!email || !password || !username) {
            return res.json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }

        const user = await User.create({ email, password, username, createdAt });

        const token = createSecretToken(user._id);

        // Secure cookie handling
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure cookie for production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Cross-origin in production
        });

        res.status(201).json({ 
            message: "User signed up successfully", 
            success: true, 
            user: {
                username: user.username,
                email: user.email
            },
            token 
        });
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error during signup", success: false });
    }
};

const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        console.log("Login attempt - Received data:", req.body);

        if (!email || !password) {
            console.log("Login failed - Missing fields");
            return res.status(400).json({ 
                message: 'All fields are required',
                success: false 
            });
        }

        const user = await User.findOne({ email });
        console.log("User found:", user ? "Yes" : "No");

        if (!user) {
            console.log("Login failed - User not found");
            return res.status(401).json({ 
                message: 'Incorrect email or password',
                success: false 
            });
        }

        const auth = await bcrypt.compare(password, user.password);
        console.log("Password match:", auth ? "Yes" : "No");

        if (!auth) {
            console.log("Login failed - Incorrect password");
            return res.status(401).json({ 
                message: 'Incorrect email or password',
                success: false 
            });
        }

        const token = createSecretToken(user._id);
        console.log("Token generated successfully");

        // Set cookie with token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
        });

        const response = { 
            message: "User logged in successfully", 
            success: true,
            token,
            user: {
                username: user.username,
                email: user.email
            }
        };
        console.log("Sending response:", response);

        res.status(200).json(response);
        next();
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            message: "Error during login", 
            success: false,
            error: error.message 
        });
    }
};

const Logout = async (req, res) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        console.log("Logout - Auth header:", authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("Logout - Invalid authorization header");
            return res.status(401).json({ 
                status: false, 
                message: "Invalid authorization header" 
            });
        }

        const token = authHeader.split(' ')[1];
        console.log("Logout - Token extracted:", token);

        if (!token) {
            console.log("Logout - No token provided");
            return res.status(401).json({ 
                status: false, 
                message: "No token provided" 
            });
        }

        // Verify token and get user
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Logout - Token verified for user:", decoded.id);

            // Clear user session if it exists
            if (req.session) {
                req.session.destroy((err) => {
                    if (err) {
                        console.error("Error destroying session:", err);
                    }
                });
            }
        } catch (error) {
            console.error("Logout - Token verification failed:", error);
        }

        // Clear all cookies
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        // Clear any other cookies that might be set
        const cookies = req.cookies;
        for (let cookie in cookies) {
            res.clearCookie(cookie, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/'
            });
        }

        // Send success response
        res.status(200).json({ 
            status: true, 
            message: "Logged out successfully" 
        });
    } catch (error) {
        console.error("Logout error:", error);
        // Still try to clear everything even if there's an error
        if (req.session) {
            req.session.destroy();
        }
        
        // Clear all cookies
        const cookies = req.cookies;
        for (let cookie in cookies) {
            res.clearCookie(cookie, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/'
            });
        }
        
        res.status(200).json({ 
            status: true, 
            message: "Logged out successfully" 
        });
    }
};

module.exports = { Signup, Login, Logout };
