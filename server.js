const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const router = require('./routes/user.routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();

connectDB();

const app = express();

app.use(bodyParser.json());//dispacher les body requettes

app.use(cookieParser());


const corsOptions = {
  origin: process.env.FRONEND_CORS_URL, // Remplacez par votre domaine front-end
  credentials: true, // Permet l'envoi des cookies à travers les domaines
  allowedHeaders: ['sessionId','Origin, X-Requested-With, Content-Type, Accept, Authorization'], // Headers autorisés
  exposedHeaders: ['sessionId'], // Headers exposés
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Méthodes HTTP autorisées
  preflightContinue: false,
};

app.use(cors(corsOptions));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.get('/', (req, res) => {
    res.send('Hello World!')
  });

app.use('/api', router);


// server
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });