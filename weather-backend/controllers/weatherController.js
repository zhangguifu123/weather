const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');

// weatherController.js
router.get('/', async (req, res) => {
    try {
      const { city, zip } = req.query;
      if (!city && !zip) {
        return res.status(400).json({ error: 'Please provide ?city= or ?zip=' });
      }
  
      let data;
      if (city) {
        data = await weatherService.getWeatherByCity(city);
      } else {
        data = await weatherService.getWeatherByZip(zip);
      }
      return res.json(data);
    } catch (error) {
      console.error('weatherController error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  });
  
module.exports = router;
