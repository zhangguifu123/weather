const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');

/**
 * Handles weather requests based on suburb, city, or postcode.
 *
 * Query Parameters:
 * - postcode: The postal code to fetch weather for.
 * - suburb: The suburb name to fetch weather for.
 * - city: The city name to fetch weather for.
 */
router.get('/', async (req, res) => {
  try {
    const { postcode, suburb, city } = req.query;

    if (!postcode && !suburb && !city) {
      return res.status(400).json({ error: 'Please provide ?postcode=, ?suburb=, or ?city=' });
    }

    let data;
    if (postcode) {
      data = await weatherService.getWeatherByZip(postcode);
    } else if (suburb) {
      data = await weatherService.getWeatherByCity(suburb);
    } else if (city) {
      data = await weatherService.getWeatherByCity(city);
    }

    return res.json(data);
  } catch (error) {
    console.error('weatherController error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Fetches weather for all Australian capital cities.
 */
router.get('/capitals', async (req, res) => {
    try {
      const capitalsWeather = await weatherService.getCapitalsWeather();
      return res.json(capitalsWeather);
    } catch (error) {
      console.error('weatherController error (capitals):', error.message);
      return res.status(500).json({ error: error.message });
    }
  });
  
module.exports = router;
