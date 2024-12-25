/**
 * weatherService.js
 *
 * 1) For a city or zip code, uses OpenWeather's geocoding API:
 *    - /geo/1.0/direct  (if city)
 *    - /geo/1.0/zip    (if zip)
 * 2) Once lat/lon is obtained, calls:
 *    https://api.openweathermap.org/data/3.0/onecall?lat=...&lon=...&exclude=hourly,daily&appid=...
 *    (which returns current weather + possibly other data, depending on excludes).
 * 3) Saves the search record in a file-based history.
 * 4) Returns the data to the caller.
 */

const axios = require('axios');
const historyModel = require('../models/historyModel'); // Your file-based storage
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';

async function getWeatherByCity(city) {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
    const geoResp = await axios.get(geoUrl);
    if (!geoResp.data || geoResp.data.length === 0) {
      throw new Error(`City not found: ${city}`);
    }
  
    const lat = geoResp.data[0].lat;
    const lon = geoResp.data[0].lon;
    const resolvedName = geoResp.data[0].name || city;
  
    // ---- NEW: Try to extract region from geocoding
    // Could be 'state' field, or fallback to country if no state
    const region = geoResp.data[0].state || geoResp.data[0].country || '';
  
    const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${OPENWEATHER_API_KEY}`;
    const oneCallResp = await axios.get(oneCallUrl);
    const weatherData = oneCallResp.data;
  
    await historyModel.saveSearch({
      timestamp: new Date().toISOString(),
      query: city,
      lat,
      lon,
      region_name: region, // <-- Store the region name
      current_temp: weatherData.current?.temp,
      weather_description: weatherData.current?.weather?.[0]?.description,
    });
  
    return {
      location: resolvedName,
      lat,
      lon,
      region,         // <-- Return region in the top-level response
      ...weatherData,
    };
  }
  

  async function getWeatherByZip(zip) {
    const zipUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${encodeURIComponent(zip)}&appid=${OPENWEATHER_API_KEY}`;
    const zipResp = await axios.get(zipUrl);
    if (!zipResp.data || !zipResp.data.lat) {
      throw new Error(`ZIP not found: ${zip}`);
    }
  
    const lat = zipResp.data.lat;
    const lon = zipResp.data.lon;
    const resolvedName = `${zipResp.data.name}, ${zipResp.data.country}`;
  
    // ---- NEW: Attempt to parse region. The /geo/1.0/zip response
    // might not always provide a "state" field, but if it does:
    // For example, zipResp.data could have { name: 'Point Cook', state: 'Victoria', country: 'AU' } if OpenWeather returns it.
    const region = zipResp.data.state || zipResp.data.country || '';
  
    const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${OPENWEATHER_API_KEY}`;
    const oneCallResp = await axios.get(oneCallUrl);
    const weatherData = oneCallResp.data;
  
    await historyModel.saveSearch({
      timestamp: new Date().toISOString(),
      query: zip,
      lat,
      lon,
      region_name: region, // <-- Store the region
      current_temp: weatherData.current?.temp,
      weather_description: weatherData.current?.weather?.[0]?.description,
    });
  
    return {
      location: resolvedName,
      lat,
      lon,
      region,        // <-- Return region in the top-level response
      ...weatherData,
    };
  }
  
module.exports = {
  getWeatherByCity,
  getWeatherByZip,
};
