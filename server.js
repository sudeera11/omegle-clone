const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');  // Required for serving static files

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.static('public'));  // Serve static files from the 'public' directory

// Serve the landing page at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the chat page
app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Serve the video page
app.get('/video', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'video.html'));
});

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
