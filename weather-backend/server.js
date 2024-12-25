/*
 * server.js
 *
 * Main entry point for the Express application.
 * Loads environment variables, sets up middleware,
 * and defines the routes using the weatherController.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const googleMapsController = require('./controllers/googleMapsController');
const weatherController = require('./controllers/weatherController');
const historyController = require('./controllers/historyController'); 

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Google Maps Autocomplete
app.use('/api/maps', googleMapsController);

// Weather routes
app.use('/api/weather', weatherController);

// History routes
app.use('/api/history', historyController);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
