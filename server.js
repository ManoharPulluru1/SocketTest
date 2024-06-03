const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 4000;

let users = [];

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.emit("users", users);

  socket.on("addUser", (data) => {
    users.push({
      name: data.username,
      lat: data.lat,
      lng: data.lng,
      index: users.length,
    });
    console.log(users, "addUser");
    io.emit("users", users);
  });

  socket.on("updateUserMessage", (index, message) => {
    console.log(index, message, "updateUserMessage");
    users[index].message = message;
    io.emit("users", users);
  });

  socket.on("updateUserLocation", (index, lat, lng) => {
    console.log(index, lat, lng, "updateUserLocation");
    users[index].lat = lat;
    users[index].lng = lng;
    io.emit("users", users);
  });

  socket.on("resetUsers", () => {
    users = [];
    io.emit("users", users);
  } );

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
