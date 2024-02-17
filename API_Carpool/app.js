const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const router = express.Router();
const { connectDatabase } = require('./config/mongoDb');

//HELMET package
/* helmet is a middleware for Express.js that helps secure your web application by setting various HTTP headers. These headers enhance the security of your application by mitigating common web vulnerabilities. */
// https://www.youtube.com/watch?v=cmT7i3Mty9c

//const helmet = require('helmet');
//app.use(helmet());

// Load environment variables from .env file
dotenv.config();

// Use CORS
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable cookies and HTTP authentication
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));

connectDatabase();

// configure app to use bodyParser()
// use JSON instead of x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Prefix all routes with "/api"
app.use('/api', router);

 // test route to make sure everything is working
 // GET http://localhost:3000)
  app.get('/', async(req, res) => {
    try {
      res.json({ message: 'Welcome to Carpool api!' });
    } catch (err) {
      console.error('Error in / route:', err);
      res.status(500).send('Something went wrong!');
    }
  });

// API ROUTES go here....
const userRoutes = require('./app/routes/userRoutes');
router.use('/user', userRoutes);

const ofertaBoleiaRoutes = require('./app/routes/ofertaBoleiaRoutes');
router.use('/ofertaBoleia', ofertaBoleiaRoutes);

const boleiaRoutes = require('./app/routes/boleiaRoutes');
router.use('/boleias', boleiaRoutes);

const candidaturaRoutes = require('./app/routes/candidaturaRoutes');
router.use('/candidatura', candidaturaRoutes);

//error management if the route is not found
app.use((req, res, next) => {
    const error = new Error(`The requested URL ${req.originalUrl} was not found!`);
    error.status = 404;
    next(error);
})

//error message print
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: { message: error.message || 'Internal Server Error' }
    })
})

module.exports = app;
