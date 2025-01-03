const express = require("express");
const app = express();
const http = require("http");
const { Server: SocketIoServer } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 8000;

// Import your routes
const GameRoutes = require("./Routes/GameRoutes");
const AdminRoute = require("./Routes/AdminRoute");
const UserRoute = require("./Routes/UserRoute");
const BetRoutes = require("./Routes/BetRoutes");
const SettingRoutes = require("./Routes/SettingRoutes");
const BankRoutes = require("./Routes/BankRoutes");
const PlayerRoutes = require("./Routes/PlayerRoutes");
const PaymentRoutes = require("./Routes/PaymentRoutes");
const PlaneCrashRoutes = require("./Routes/PlaneCrashRoutes");
const UserKycRoutes = require("./Routes/UserKycRoutes");
const PromoCodeRoutes = require("./Routes/PromoCodeRoutes");

const AviatorHistoryRoutes = require("./Routes/Aviator/AviatorHistoryRoutes");

//new route
const LeadBoard = require("./Routes/LeadBoardRoutes");
const Banner = require("./Routes/BannerRoutes");

// Connect to the database
connectDB();
const allowedOrigins = [
  "https://aviatorgame-frontend.vercel.app", // Website frontend
  "https://aviatorgame-web.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
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
// Create HTTP server and Socket.IO server
const server = http.createServer(app);
const io = new SocketIoServer(server, {
  path: "/socket.io", // Correct path for Socket.IO
  cors: {
    origin: "https://aviatorgame-frontend.vercel.app", // Adjust according to your frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// app.use('/api', GameRoutes(io));

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Use your routes
// app.use('/api', GameRoutes(io));
app.use("/api", UserRoute);
app.use("/api", AdminRoute);
app.use("/api", BetRoutes);
app.use("/api", SettingRoutes);
app.use("/api", BankRoutes);
app.use("/api", PlayerRoutes);
app.use("/api", PaymentRoutes);
app.use("/api", PlaneCrashRoutes);
app.use("/api", UserKycRoutes);
app.use("/api", PromoCodeRoutes);
app.use("/api", AviatorHistoryRoutes);

app.use("/api", LeadBoard);
app.use("/api", Banner);

// Root route
app.get("/", (req, res) => {
  res.send("Hello World !");
});

// Handle Socket.IO connection event
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Disable default server timeout
server.timeout = 0;
