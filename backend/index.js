require("dotenv").config();

const Holding = require('./model/HoldingModels');
const {PositionModels} = require("./model/PositionModels");
const {OrdersModel} = require("./model/OrderModels");
const User = require("./model/UserModel");
const {Login} = require("./controllers/AuthControllers");
const passport = require("passport");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const { userVerification } = require("./middlewares/AuthMiddleware");
const { WatchlistUser } = require("./middlewares/watchlist");

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const jwt = require("jsonwebtoken");

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Session middleware
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: 'sessions'
  }),
  cookie: {
    secure: false, // Set to false for development
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// MongoDB connection
const mongodburl = process.env.MONGO_URL;
if (!mongodburl) {
  console.error("Error: MONGO_URI environment variable is not set.");
  process.exit(1);
}

mongoose.connect(mongodburl)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Initialize passport
app.use(passport.initialize());

// Routes
app.use("/api", authRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.get("/allHoldings" ,async(req,res) =>{
     let allHoldings = await Holding.find({});
    //  console.log(allHoldings);
     res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  try {
    let allPositions = await PositionModels.find({});
    console.log(allPositions,"all the positions");
    res.json(allPositions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

app.post('/api/newOrder', userVerification, async (req, res) => {
    try {
        const { name, qty, price, mode } = req.body;
        console.log("Received order request:", { name, qty, price, mode, userId: req.userId });

        // Validate input
        if (!name || !qty || !price || !mode) {
            console.log("Missing required fields");
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields' 
            });
        }

        if (qty <= 0 || price <= 0) {
            console.log("Invalid quantity or price");
            return res.status(400).json({ 
                success: false, 
                error: 'Quantity and price must be greater than 0' 
            });
        }

        if (mode !== 'BUY' && mode !== 'SELL') {
            console.log("Invalid order mode");
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid order mode' 
            });
        }

        // Create new order
        const newOrder = new OrdersModel({
            name,
            qty,
            price,
            mode,
            userId: req.userId,
            status: 'PENDING'
        });

        console.log("Creating new order:", newOrder);

        // Save order
        const savedOrder = await newOrder.save();
        console.log("Order saved successfully:", savedOrder);

        // Send success response
        const successMessage = mode === 'BUY' 
            ? `Buy order placed successfully for ${qty} units of ${name} at ₹${price}`
            : `Sell order placed successfully for ${qty} units of ${name} at ₹${price}`;

        res.status(201).json({ 
            success: true, 
            message: successMessage,
            order: savedOrder 
        });

    } catch (err) {
        console.error("Order save error:", err);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to create order. Please try again.' 
        });
    }
});
app.get("/allOrders",userVerification, async(req,res) =>{
  try {
    const allOrders = await OrdersModel.find({ userId: req.userId }).sort({ createdAt: -1 }); // Fetch user's orders, most recent first
    res.json({ success: true, allOrders: allOrders || [] }); 
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// Delete endpoint
app.delete('/allorders/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await OrdersModel.findByIdAndDelete(id);
    if (!deletedOrder) {
      req.flash("your order is not found")
      return res.status(404).json({ message: 'Order not found' });
   
    }
    res.status(200).json({ message: 'Order deleted successfully', deletedOrder });
    req.flash("your order deleted successfully");
  } catch (error) {
    req.flash("your order is not delete");
    res.status(500).json({ message: 'Error deleting order', error });
  }
});

// creating an api to get the token for the dashboard to verify the user in the frontend of the dashboard...
// only fetching the token from the backend get request

app.get("/getToken", async (req, res, next) => {
  // Get token from either cookie or Authorization header
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  console.log("Token received:", token);

  if (!token) {
    return res.status(401).json({ status: false, message: "No token provided" });
  }

  // Verifying token
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error("JWT verification failed:", err);
      return res.status(403).json({ status: false, message: "Invalid or expired token" });
    }

    // If verification succeeds
    res.status(200).json({ status: true, message: "Token is valid", token });
  });
});

// Add verify-token endpoint
app.get('/api/verify-token', userVerification, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        status: false, 
        message: "User not found" 
      });
    }

    res.status(200).json({ 
      status: true, 
      message: "Token is valid",
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ 
      status: false, 
      message: "Error verifying token" 
    });
  }
});

