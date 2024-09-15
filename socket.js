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
    origin: process.env.FRONEND_CORS_URL, // Remplacez par votre domaine front-end 
    credentials: true, // Permet l'envoi des cookies à travers les domaines
    allowedHeaders: ['sessionId', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'], // Headers autorisés
    exposedHeaders: ['sessionId'], // Headers exposés
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], // Méthodes HTTP autorisées
  },
});

let notifications = [];

// Handle client connections
io.on('connection', (socket) => {  // console.log('New client connected:', socket.id);

  socket.emit('notifications', notifications);

  socket.on("notifications_received", () => {
    notifications = []; // Clear the notifications once they've been received
  });

  socket.on('notification', (data) => {
    notifications.push({ data });
  });

  socket.on('disconnect', (reason) => {
    console.log('Client disconnected:', socket.id, 'Reason:', reason);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});
// Export the app, io, and server instances
module.exports = { app, io, server };
