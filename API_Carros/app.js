const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// load .env data
dotenv.config();

// USAR CORS
const cors = require('cors');
const corsOptions = { origin: '*' };
app.use(cors(corsOptions));

// DATABASE CONNECTION
mongoose.set('strictQuery', true);
const server = process.env.DB_SERVER;
const dbName = process.env.DB_NAME;

mongoose.connect(`mongodb+srv://${server}/${dbName}`);
const db = mongoose.connection;
db.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

// BodyParser configs
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ROUTES FOR OUR API
const router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use((req, res, next) => {
  console.log(req.method + ' : ' + req.url);
  next(); // make sure we go to the next routes and don't stop here
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

let routeCarros = require('./app/carroRoute');
router.use('/carros', routeCarros);

let routeLocal = require("./app/local");
router.use("/municipios/freguesias", routeLocal);  

// Use the router for /api routes
app.use('/api', router);

// Define a root route
app.get('/', (req, res) => {
  try {
    console.log('Connected to carros Api');
    res.status(200).send('Connected to carros Api');
  } catch (err) {
    console.error('Error', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = app;