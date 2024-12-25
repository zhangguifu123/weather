/**
 * googleMapsController.js
 *
 * 1) /api/maps/autocomplete?input=Lo  => returns predictions
 * 2) /api/maps/select?place_id=xxx    => fetch place details => find postal_code => call weather
 */

const express = require('express');
const router = express.Router();
const googleMapsService = require('../services/googleMapsService');
const weatherService = require('../services/weatherService'); // we'll reuse

// Autocomplete route
router.get('/autocomplete', async (req, res) => {
  try {
    const { input } = req.query;
    if (!input) {
      return res.status(400).json({ error: 'No input query provided' });
    }

    const suggestions = await googleMapsService.getPlaceAutocomplete(input);
    return res.json(suggestions); // e.g. [{ description, place_id }, ...]
  } catch (error) {
    console.error('autocomplete error:', error.message);
    return res.status(500).json({ error: 'Failed to get autocomplete' });
  }
});

// Place select route: we handle place_id => postal_code => weather
router.get('/select', async (req, res) => {
  try {
    const { place_id } = req.query;
    if (!place_id) {
      return res.status(400).json({ error: 'No place_id provided' });
    }

    // 1) Call place details => postal_code
    const postalCode = await googleMapsService.getPostalCodeByPlaceId(place_id);
    if (!postalCode) {
      return res.status(404).json({ error: 'No postal code found for this place' });
    }

    // 2) Call weather using zip=postalCode,AU
    // If you always want "AU"
    const zipParam = `${postalCode},AU`;

    const weatherData = await weatherService.getWeatherByZip(zipParam);

    return res.json(weatherData);
  } catch (error) {
    console.error('select error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
