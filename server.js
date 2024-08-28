const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const router = require('./routes/user.routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const { requireAuth } = require('./middlewares/authAdmin');
const { app, server } = require('./socket.js');

dotenv.config();

connectDB();


app.use(
  bodyParser.json({
      verify: function(req, res, buf) {
          req.rawBody = buf;
      }
  })
);

app.use(bodyParser.json());//dispacher les body requettes

app.use(cookieParser());


const corsOptions = {
  origin: process.env.FRONEND_CORS_URL, // Remplacez par votre domaine front-end 
  credentials: true, // Permet l'envoi des cookies à travers les domaines
  allowedHeaders: ['sessionId','Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'], // Headers autorisés
  exposedHeaders: ['sessionId'], // Headers exposés
  methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'], // Méthodes HTTP autorisées
  preflightContinue: false,
};

app.use(cors(corsOptions));

app.get('/jwtid', requireAuth, (req, res) => {
  
  const responseData = { userId: req.user , role: req.role };

  res.status(200).send({ responseData });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.get('/', (req, res) => {
    res.send('Hello World!')
  });

app.use('/api', router);

server.listen(process.env.PORT, () => {
  console.log(`Le serveur écoute sur le port ${process.env.PORT}`);
});
