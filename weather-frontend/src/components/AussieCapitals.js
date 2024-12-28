import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Backend API endpoint for fetching Australian capitals weather
const BACKEND_CAPITALS_WEATHER = 'http://localhost:8080/api/weather/capitals'; // Replace localhost with backend's public IP

// Base URL for OpenWeather icons
const OPENWEATHER_ICON_URL = 'http://openweathermap.org/img/wn/';

// Map of weather conditions to background colors for styling
const weatherColorMap = {
    Clear: 'bg-orange-400', // Sunny
    Clouds: 'bg-gray-400', // Cloudy
    Rain: 'bg-blue-700', // Rainy
    Drizzle: 'bg-blue-300', // Light rain
    Thunderstorm: 'bg-purple-600', // Stormy
    Snow: 'bg-white text-black', // Snowy
    Mist: 'bg-gray-300', // Misty
    Fog: 'bg-gray-400', // Foggy
    Haze: 'bg-yellow-200', // Hazy
    Smoke: 'bg-gray-600', // Smoky
    default: 'bg-gray-200', // Default fallback
};

export default function AussieCapitals() {
    const [citiesWeather, setCitiesWeather] = useState([]); // State to store weather data
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        async function fetchCapitalsWeather() {
            try {
                const resp = await axios.get(BACKEND_CAPITALS_WEATHER);
                setCitiesWeather(resp.data); // Save weather data to state
            } catch (err) {
                console.error('Error fetching capitals weather:', err);
                setError('Failed to load Aussie capitals weather.');
            }
        }

        fetchCapitalsWeather(); // Call the function on component mount
    }, []);

    // Render error message if encountered
    if (error) {
        return <div className="text-red-500 mt-4">{error}</div>;
    }

    // Render loading state while data is being fetched
    if (!citiesWeather.length) {
        return <div className="text-gray-600 mt-4">Loading Aussie capitals weather...</div>;
    }

    // Render weather cards for all cities
    return (
        <div className="mt-4 bg-white rounded shadow p-4">
            <h2 className="text-lg font-bold mb-2">Aussie Capitals Weather</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {citiesWeather.map(cityWeather => {
                    const { query: city, temp, weather_main, weather_description, lat, lon } = cityWeather;
                    const condition = weather_main || 'default'; // Weather condition
                    const cardBgColor = weatherColorMap[condition] || weatherColorMap.default; // Card background color

                    return (
                        <div
                            key={city}
                            className={`rounded p-4 shadow-md text-white ${cardBgColor} flex items-center`}
                        >
                            {/* Weather icon */}
                            <div className="flex-shrink-0 w-8 h-8 bg-white/50 rounded-full shadow-lg flex items-center justify-center mr-4">
                                <img
                                    src={`${OPENWEATHER_ICON_URL}${cityWeather.icon || '01d'}@2x.png`}
                                    alt={weather_description}
                                    className="w-8 h-8 drop-shadow-md"
                                />
                            </div>
                            {/* Weather details */}
                            <div>
                                <h3 className="font-bold text-lg">{city}</h3>
                                <div className="space-y-1 mt-1">
                                    <p className="text-sm">
                                        <span className="font-semibold">Temp:</span> {temp} °C
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-semibold">Condition:</span> {weather_description}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-semibold">Coordinates:</span> {lat}, {lon}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
