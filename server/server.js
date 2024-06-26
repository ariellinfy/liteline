const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Server } = require("socket.io");
const { createServer } = require("node:http");

const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { initWebSocket } = require("./socket/socket");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.get("/health", (req, res) => {
  return res.status(200).send("server alive");
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes/endpoints
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);

// Add headers before the routes are defined
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", `${process.env.CLIENT_URL}`);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.get("/", (req, res) => {
  res.send("hello backend");
});

// setup websocket
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

initWebSocket(io);

server.listen(PORT, () => {
  console.log(
    `Server is running at ${
      PORT ? `http://localhost:${PORT}` : process.env.SERVER_URL
    }.`
  );
});
