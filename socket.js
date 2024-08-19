// socket.js
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

// Create an Express application
const app = express();

// Create a server
const server = http.createServer(app);

// Set up Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins
    methods: ["POST"], // Allow POST method
  },
});

// Handle client connections
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('notification', (data) => {
    console.log('Notification received:', data);
  })
});


// Export the app, io, and server instances
module.exports = { app, io, server };
