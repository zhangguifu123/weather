/*
 * WeatherCard.js
 *
 * This component displays weather data for a given city.
 * It accepts props such as 'name', 'temp', 'description', etc.
 * and shows an icon or image that corresponds to the weather condition.
 *
 * Tailwind is used for styling, and the image references
 * assume icons are stored in the public/images directory.
 */

import React from 'react';

/**
 * Determines which icon (e.g., sunny.jpg) to display
 * based on the 'main' weather condition (Clouds, Rain, etc.).
 * @param {string} mainWeather - e.g. 'Clouds', 'Clear', 'Rain'
 * @returns {string} - file name in /images folder
 */
function getWeatherIcon(mainWeather) {
  const condition = mainWeather?.toLowerCase();
  if (condition === 'clear') return 'public/sunny.jpg';
  if (condition === 'clouds') return 'public/cloudy.jpg';
  if (['rain', 'drizzle', 'thunderstorm'].includes(condition)) return 'public/rainy.jpg';
  return 'default.jpg';
}

function WeatherCard({ name, temp, description, mainWeather }) {
  const iconFile = getWeatherIcon(mainWeather);

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded shadow w-full max-w-xs">
      <h2 className="text-xl font-semibold mb-2">{name}</h2>

      {/* Weather Icon */}
      <img
        src={`/images/${iconFile}`}
        alt={description || 'Weather icon'}
        className="h-20 w-20 object-contain mb-2"
      />

      {/* Temperature */}
      <p className="text-lg font-medium">
        {temp !== undefined ? `${temp}°C` : 'N/A'}
      </p>

      {/* Description */}
      {description && (
        <p className="text-gray-600 capitalize">{description}</p>
      )}
    </div>
  );
}

export default WeatherCard;
