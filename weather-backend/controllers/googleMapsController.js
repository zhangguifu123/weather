const express = require('express');
const router = express.Router();
const googleMapsService = require('../services/googleMapsService');

/**
 * Autocomplete with details
 *
 * Query Parameters:
 * - input: The partial address input by the user.
 * Returns a list of predictions with suburb, city, and postcode.
 */
router.get('/autocomplete', async (req, res) => {
  try {
    const { input } = req.query;
    if (!input) {
      return res.status(400).json({ error: 'No input query provided' });
    }

    const results = await googleMapsService.getAutocompleteWithDetails(input);
    return res.json(results);
  } catch (error) {
    console.error('Autocomplete error:', error.message);
    return res.status(500).json({ error: 'Failed to get autocomplete suggestions' });
  }
});

module.exports = router;
