const axios = require('axios');

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

async function getPlaceAutocomplete(input) {
  // Same as before:
  const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
  const params = {
    input,
    key: GOOGLE_API_KEY,
    components: 'country:au', // or your region
  };
  const resp = await axios.get(url, { params });
  if (resp.data.status !== 'OK' && resp.data.status !== 'ZERO_RESULTS') {
    throw new Error(`Places autocomplete error: ${resp.data.status}`);
  }
  return resp.data.predictions.map((p) => ({
    description: p.description,
    place_id: p.place_id,
  }));
}

/**
 * getPostalCodeByPlaceId
 * Calls Place Details with fields=address_components,
 * returns the postal_code from address_components if found.
 */
async function getPostalCodeByPlaceId(placeId) {
  const detailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
  const params = {
    place_id: placeId,
    key: GOOGLE_API_KEY,
    fields: 'address_components', // we only need address components
  };

  const resp = await axios.get(detailsUrl, { params });
  if (resp.data.status !== 'OK') {
    throw new Error(`Place Details error: ${resp.data.status}`);
  }

  const comps = resp.data.result?.address_components || [];
  const postal = comps.find((c) => c.types.includes('postal_code'));
  return postal ? postal.short_name : null; // or postal.long_name
}

module.exports = {
  getPlaceAutocomplete,
  getPostalCodeByPlaceId,
};
