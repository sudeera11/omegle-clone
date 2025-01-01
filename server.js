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

  // Handle messages (for signaling)
  socket.on('signal', (data) => {
    // Send the signal to the intended peer
    socket.to(data.target).emit('signal', {
      signal: data.signal,
      sender: socket.id,
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    users = users.filter((user) => user !== socket.id);
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log('Server is running on port 5000');
});
