// socket.js
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

// Create an Express application
const app = express();

// Create a server
const server = http.createServer(app);

// Middleware pour loguer les en-têtes des requêtes
app.use((req, res, next) => {
  console.log('Request headers:', req.headers);
  next();
});

// Middleware pour gérer les requêtes OPTIONS
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', process.env.FRONEND_CORS_URL);
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'sessionId, Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(204).end(); // Réponds avec un statut 204 No Content pour les requêtes OPTIONS
  }
  next();
});

// Set up Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.FRONEND_CORS_URL, // Remplacez par votre domaine front-end 
    credentials: true, // Permet l'envoi des cookies à travers les domaines
    methods: ["GET", "POST"], // Méthodes HTTP autorisées
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
