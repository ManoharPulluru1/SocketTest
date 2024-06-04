const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

let users = [];

const PORT = process.env.PORT || 4000;
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("addAnUser", (user) => {
    console.log(user, "=====> user");
    users.push(user);
    console.log(users, "users");
    io.emit("users", users);
  });

  socket.on("checkExistingUser", (mobile) => {
    const existingUser = users.find((user) => user.mobile === mobile);
    console.log(existingUser, "existingUser");
    socket.emit("existingUser", !!existingUser);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

