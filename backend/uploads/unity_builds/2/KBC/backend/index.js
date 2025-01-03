const express = require("express");
const app = express();
const http = require("http");
const { Server: SocketIoServer } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const questionRoute = require("./routes/questionRoute");

const PORT = process.env.PORT || 8000;

// Database Connection
connectDB();

// CORS Configuration
const corsOption = {
  origin: "http://localhost:5173", // Your frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());

// HTTP and Socket.IO Server
const server = http.createServer(app);
const io = new SocketIoServer(server, {
  cors: corsOption,
});

// Global Socket.IO Instance
app.set("socketio", io);

// Routes
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api", questionRoute);

// Start Server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
