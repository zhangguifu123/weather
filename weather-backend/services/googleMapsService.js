const axios = require('axios');
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

/**
 * Fetches autocomplete suggestions and resolves place_id to address components.
 *
 * @param {string} input - User input for place search.
 * @returns {Array} - List of suggestions with suburb, city, and postcode.
 */
async function getAutocompleteWithDetails(input) {
  // Step 1: Call Autocomplete API
  const autocompleteUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
  const autocompleteParams = {
    input,
    key: GOOGLE_API_KEY,
    components: 'country:au',
  };

  const autocompleteResp = await axios.get(autocompleteUrl, { params: autocompleteParams });
  if (autocompleteResp.data.status !== 'OK' && autocompleteResp.data.status !== 'ZERO_RESULTS') {
    throw new Error(`Autocomplete error: ${autocompleteResp.data.status}`);
  }

  const suggestions = autocompleteResp.data.predictions;

  // Step 2: For each suggestion, resolve place_id to get details
  const detailsPromises = suggestions.map(async (suggestion) => {
    const placeDetailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
    const placeDetailsParams = {
      place_id: suggestion.place_id,
      key: GOOGLE_API_KEY,
      fields: 'address_components', // Fetch only address components
    };

    const detailsResp = await axios.get(placeDetailsUrl, { params: placeDetailsParams });
    if (detailsResp.data.status !== 'OK') {
      throw new Error(`Place Details error: ${detailsResp.data.status}`);
    }

    const addressComponents = detailsResp.data.result.address_components;

    // Extract suburb, city, and postcode
    const suburbComp = addressComponents.find((c) =>
      c.types.includes('locality') || c.types.includes('sublocality')
    );
    const cityComp = addressComponents.find((c) => c.types.includes('administrative_area_level_2'));
    const postalComp = addressComponents.find((c) => c.types.includes('postal_code'));

    return {
      description: suggestion.description,
      place_id: suggestion.place_id,
      suburb: suburbComp ? suburbComp.long_name : null,
      city: cityComp ? cityComp.long_name : null,
      postcode: postalComp ? postalComp.short_name : null,
    };
  });

  return Promise.all(detailsPromises);
}

module.exports = {
  getAutocompleteWithDetails,
};
