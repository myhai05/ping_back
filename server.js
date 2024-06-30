const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const router = require('./routes/user.routes');
const bodyParser = require('body-parser');

dotenv.config();

connectDB();

const app = express();


const corsOptions = {
    origin: 'http://cours.pingpro.fr',
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }

app.use(cors(corsOptions));

app.use(bodyParser.json());//dispacher les body requettes

app.get('/', (req, res) => {
    res.send('Hello World!')
  });

app.use('/api', router);

// server
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });