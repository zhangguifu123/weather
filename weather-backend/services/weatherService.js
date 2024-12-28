const axios = require('axios');
const historyModel = require('../models/historyModel');
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';

// Define units for temperature
const UNITS = 'metric';

// Australian capital cities
const capitals = [
    { city: 'Sydney', lat: -33.8688, lon: 151.2093 },
    { city: 'Melbourne', lat: -37.8136, lon: 144.9631 },
    { city: 'Brisbane', lat: -27.4698, lon: 153.0251 },
    { city: 'Perth', lat: -31.9505, lon: 115.8605 },
    { city: 'Adelaide', lat: -34.9285, lon: 138.6007 },
    { city: 'Hobart', lat: -42.8821, lon: 147.3272 },
    { city: 'Darwin', lat: -12.4611, lon: 130.8418 },
    { city: 'Canberra', lat: -35.2809, lon: 149.1300 }
  ];

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
  const { lat, lon, name, state } = geoResp.data[0];
  
  const oneCallUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},au&appid=${OPENWEATHER_API_KEY}`;

  const weatherResp = await axios.get(oneCallUrl);
  const { main, weather } = weatherResp.data;
  // Format the data into the desired structure
  const formattedData = {
        timestamp: new Date().toISOString(),
        query: city,
        lat,
        lon,
        state: state || weatherResp.data.sys.country, // Default to country if state is not available
        suburb: name,
        temp: main.temp,
        weather_main: weather[0]?.main,
        weather_description: weather[0]?.description,
  };

  // Save to history
  await historyModel.saveSearch(formattedData);

  return formattedData;
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

/**
 * Fetches weather data for all Australian capital cities.
 *
 * @returns {Array} - Weather data for all capital cities.
 */
async function getCapitalsWeather() {
    return Promise.all(
      capitals.map(async ({ city, lat, lon }) => {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${UNITS}&appid=${OPENWEATHER_API_KEY}`;
        const weatherResp = await axios.get(weatherUrl);
  
        const { main, weather } = weatherResp.data;
  
        return {
          timestamp: new Date().toISOString(),
          query: city,
          lat,
          lon,
          state: 'AU',
          suburb: city,
          temp: main.temp,
          weather_main: weather[0]?.main,
          weather_description: weather[0]?.description,
        };
      })
    );
  }

module.exports = {
  getWeatherByCity,
  getWeatherByZip,
  getCapitalsWeather,
};


