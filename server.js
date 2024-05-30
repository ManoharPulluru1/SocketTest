const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 4000;

const formatDateTime = (date) => {
  return date.toLocaleString("en-GB", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('newMessage', (data) => {
    const currentDate = new Date();
    const formattedDateTime = formatDateTime(currentDate);
    const messageWithDateTime = {
      message: data,
      dateTime: formattedDateTime,
    };
    io.emit('notification', messageWithDateTime);
    console.log(`Received and emitted new message: ${data} at ${formattedDateTime}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use(cors()); // Enable CORS for all routes

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
