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

  socket.emit("users", users);

  socket.on("addAnUser", (user) => {
    if (!users.find(u => u.mobile === user.mobile)) {
      users.push(user);
      io.emit("users", users);  // Emit updated users list
    }
  });

  socket.on('updateUserLocation', (user) => {
    const userToUpdate = users.find(u => u.mobile === user.mobile);
    if (userToUpdate) {
      // Update the latitude and longitude
      userToUpdate.lat = user.lat;
      userToUpdate.lng = user.lng;
      console.log(`Updated user: ${JSON.stringify(userToUpdate)}`);
      
      // Emit the updated users list
      io.emit("users", users);
    } else {
      console.log('User not found');
    }
  });

  socket.on("getUserName", (mobile) => {
    const user = users.find((user) => user.mobile === mobile);
    if (user) {
      socket.emit("userName", user.userName);
    } else {

      socket.emit("userName", null);
    }

    
  });

  socket.on("checkExistingUser", (mobile) => {
    const existingUser = users.find((user) => user.mobile === mobile);
    socket.emit("existingUser", !!existingUser);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
