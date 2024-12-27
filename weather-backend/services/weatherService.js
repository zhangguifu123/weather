const axios = require('axios');
const historyModel = require('../models/historyModel');
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';

// Define units for temperature
const UNITS = 'metric';

/**
 * Fetches weather data for a given city.
 *
 * @param {string} city - The name of the city to fetch weather for.
 * @returns {Object} - An object containing location details and weather data.
 * @throws {Error} - If the city is not found or the API request fails.
 */
async function getWeatherByCity(city) {
  const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
  const geoResp = await axios.get(geoUrl);

  if (!geoResp.data || geoResp.data.length === 0) {
    throw new Error(`City not found: ${city}`);
  }

  const { lat, lon, name, state, country } = geoResp.data[0];
  const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${UNITS}&exclude=minutely,hourly,daily,alerts&appid=${OPENWEATHER_API_KEY}`;
  const oneCallResp = await axios.get(oneCallUrl);

  // Save to history
  await historyModel.saveSearch({
    timestamp: new Date().toISOString(),
    query: city,
    lat,
    lon,
    state: state || country,
    suburb: name,
    ...oneCallResp.data.current,
  });

  return {
    location: name,
    state: state || country,
    ...oneCallResp.data,
  };
}

/**
 * Fetches weather data for a given postal code.
 *
 * @param {string} zip - The postal code to fetch weather for.
 * @returns {Object} - An object containing location details and weather data.
 * @throws {Error} - If the postal code is not found or the API request fails.
 */
async function getWeatherByZip(zip) {
  const zipUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${encodeURIComponent(zip)},AU&appid=${OPENWEATHER_API_KEY}`;
  const zipResp = await axios.get(zipUrl);

  if (!zipResp.data || !zipResp.data.lat) {
    throw new Error(`Postal code not found: ${zip}`);
  }

  const { lat, lon, name, state, country } = zipResp.data;
  const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${UNITS}&exclude=minutely,hourly,daily,alerts&appid=${OPENWEATHER_API_KEY}`;
  const oneCallResp = await axios.get(oneCallUrl);

  // Save to history
  await historyModel.saveSearch({
    timestamp: new Date().toISOString(),
    query: zip,
    lat,
    lon,
    state: state || country,
    suburb: name,
    ...oneCallResp.data.current,
  });

  return {
    location: name,
    state: state || country,
    ...oneCallResp.data,
  };
}

module.exports = {
  getWeatherByCity,
  getWeatherByZip,
};
