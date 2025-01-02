const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.static('public'));

let users = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Add user to the list
  users.push(socket.id);

  // Handle chat ready
  socket.on('chatReady', () => {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    socket.emit('chatStart', { target: randomUser });
  });

  // Handle next chat
  socket.on('nextChat', () => {
    users = users.filter(user => user !== socket.id);
    const randomUser = users[Math.floor(Math.random() * users.length)];
    socket.emit('chatStart', { target: randomUser });
  });

  // Handle video ready
  socket.on('videoReady', () => {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    socket.emit('videoStart', { target: randomUser });
  });

  // Handle next video
  socket.on('nextVideo', () => {
    users = users.filter(user => user !== socket.id);
    const randomUser = users[Math.floor(Math.random() * users.length)];
    socket.emit('videoStart', { target: randomUser });
  });

  // Handle signals (for video call setup)
  socket.on('signal', (data) => {
    socket.to(data.target).emit('signal', { signal: data.signal, sender: socket.id });
  });

  // Handle chat messages
  socket.on('chatMessage', (message) => {
    socket.broadcast.emit('chatMessage', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    users = users.filter(user => user !== socket.id);
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log('Server is running on port 5000');
});
