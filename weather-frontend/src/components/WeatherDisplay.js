import React from 'react';

// Base URL for OpenWeather icons
const OPENWEATHER_ICON_URL = 'http://openweathermap.org/img/wn/';

/**
 * Determines the background image based on the main weather condition.
 *
 * @param {string} condition - The main weather condition (e.g., 'Clear', 'Clouds').
 * @returns {string} - The filename of the background image.
 */
function getBackgroundImage(condition) {
    if (!condition) return 'default.jpg';
    const main = condition.toLowerCase();
    if (main === 'clear') return 'sunny.jpg';
    if (main === 'clouds') return 'cloudy.jpg';
    if (main.includes('rain')) return 'rainy.jpg';
    return 'default.jpg';
}

// Map of weather conditions to background colors for styling
const weatherColorMap = {
    Clear: 'bg-blue-400',
    Clouds: 'bg-gray-500',
    Rain: 'bg-blue-700',
    Drizzle: 'bg-blue-300',
    Thunderstorm: 'bg-purple-600',
    Snow: 'bg-white text-black',
    Mist: 'bg-gray-300',
    Fog: 'bg-gray-400',
    Haze: 'bg-yellow-200',
    Smoke: 'bg-gray-600',
    default: 'bg-gray-200',
};

/**
 * WeatherDisplay Component
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.data - Weather data to display.
 * @returns {JSX.Element} - Rendered component.
 */
export default function WeatherDisplay({ data }) {
    if (!data) {
        return <div className="mt-4 text-gray-600">No weather data available.</div>;
    }

    const { query: location, temp, humidity, wind_speed, wind_deg, weather_main, weather_description, icon } = data;

    // Get background image based on weather condition
    const bgImage = getBackgroundImage(weather_main);

    return (
        <div
            className={`relative mt-4 p-4 border rounded shadow-lg text-gray-100 ${weatherColorMap[weather_main] || weatherColorMap.default}`}
            style={{
                backgroundImage: `url('/${bgImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded"></div>

            <div className="relative">
                <h2 className="text-2xl font-bold mb-2">{location || 'Unknown Location'}</h2>

                <div className="flex items-center mb-4">

                    <div>
                        <p className="text-sm">
                            <span className="font-semibold">Temperature:</span> {temp} °C
                            <span className="ml-2 font-semibold">Humidity:</span> {humidity}%
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold">Wind:</span> {wind_speed} m/s, {wind_deg}°
            
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold">Weather:</span> {weather_description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
