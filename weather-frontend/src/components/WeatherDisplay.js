// WeatherDisplay.js

/**
 * WeatherDisplay Component
 *
 * This React component presents detailed weather information for a specific location.
 * It includes current weather conditions, temperature, humidity, wind details,
 * weather descriptions, and daily forecasts with corresponding weather icons.
 * The component also dynamically changes the background image based on weather conditions.
 */

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

    const { location, current, daily, region } = data;

    // 获取天气条件
    const condition = current?.weather?.[0]?.main || 'default';
    const cardBgColor = weatherColorMap[condition] || weatherColorMap.default;

    // 获取背景图片
    const bgImage = getBackgroundImage(condition);

    return (
        <div
            className={`relative mt-4 p-4 border rounded shadow-lg text-gray-100 ${cardBgColor}`}
            style={{
                backgroundImage: `url('/${bgImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* 添加半透明遮罩层 */}
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded"></div>

            {/* 内容区域 */}
            <div className="relative">
                <h2 className="text-2xl font-bold mb-2">{location || 'Unknown Location'}</h2>
                {/* {region && (
                    <p className="text-sm mb-2">
                        Region: {region}
                    </p>
                )} */}
                {current ? (
                    <div className="flex items-center">

                        <div>
                            <p className="text-sm">
                                <span className="font-semibold">Temperature:</span> {current.temp} °C
                                <span className="font-semibold ml-2">Humidity:</span> {current.humidity}%
                            </p>
                            <p className="text-sm">
                               
                            </p>
                            <p className="text-sm">
                                <span className="font-semibold ">Feels Like:</span> {current.feels_like} °C
                                <span className="font-semibold ml-7">Wind Speed:</span> {current.wind_speed} m/s
                            </p>
                            <p className="text-sm">
                                
                            </p>
                            <p className="text-sm">
                                <span className="font-semibold">Weather:</span> {current.weather[0].description}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p>No current data available.</p>
                )}

                {daily && daily.length > 0 && (
                    <div className="mt-4 bg-black bg-opacity-40 p-2 rounded">
                        <h3 className="text-lg font-semibold mb-2">Daily Forecast:</h3>
                        {daily.map((day, idx) => (
                            <div key={idx} className="text-sm mb-1 flex items-center">
                                <span className="mr-2">Day {idx + 1}:</span>
                                {day.weather && day.weather[0] && (
                                    <img
                                        src={`${OPENWEATHER_ICON_URL}${day.weather[0].icon}@2x.png`}
                                        alt={day.weather[0].description}
                                        className="w-6 h-6 mr-2"
                                    />
                                )}
                                <span>{day.temp?.day} °C - {day.weather?.[0]?.description}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
