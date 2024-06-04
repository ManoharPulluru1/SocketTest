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
    users.push(user);
    io.emit("users", users);
  });

  socket.on("getUserName", (mobile) => {
    const user = users.find((user) => user.mobile === mobile);
    if (user) {
      socket.emit("userName", user.userName);
      console.log(user.userName, "-------------user");
    } else {
      socket.emit("userName", null); // Emit null or an appropriate message if the user is not found
    }
  });

  socket.on("checkExistingUser", (mobile) => {
    const existingUser = users.find((user) => user.mobile === mobile);
    socket.emit("existingUser", !!existingUser);
  });

  socket.on("updateUserLocation", ({ userLocation, mobile }) => {
    console.log(userLocation, mobile);
    const user = users.find((user) => user.mobile === mobile);
    if (user) {
      user.lat = userLocation.lat;
      user.lng = userLocation.lng;
      io.emit("userLocation", { mobile, userLocation });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
