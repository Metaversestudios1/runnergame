const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 8000;

// Import your routes
const AdminRoute = require("./Routes/AdminRoute");
const UserRoute = require("./Routes/UserRoute");

const GameStateAndProgressRoutes = require("./Routes/GameStateAndProgressRoutes");
const LeaderBoardRoute = require("./Routes/LeaderBoardRoute");
const ShopItemRoute = require("./Routes/ShopItemRoute");
const RewardsRoute = require("./Routes/RewardsRoute");
const InventoryRoute = require("./Routes/InventoryRoute");
const EventRoute = require("./Routes/EventRoute.js");


// Connect to the database
connectDB();
const server = http.createServer(app);
const allowedOrigins = [
"http://localhost:5173", 
];
const corsOptions = {
  origin: function (origin, callback) {
    // Check if the incoming request's origin is in the allowed origins
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  credentials: true,
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Use your routes
// app.use('/api', GameRoutes(io));

app.use("/api", GameStateAndProgressRoutes);
app.use("/api", UserRoute);
app.use("/api", AdminRoute);
app.use("/api", LeaderBoardRoute);
app.use("/api", RewardsRoute);
app.use("/api", ShopItemRoute);
app.use("/api", InventoryRoute);
app.use("/api", EventRoute);




// Root route
app.get("/", (req, res) => {
  res.send("Hello World !");
});
// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


