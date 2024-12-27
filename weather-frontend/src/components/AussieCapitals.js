// AussieCapitals.js

/**
 * AussieCapitals Component
 *
 * This React component fetches and displays the current weather information
 * for a list of Australian capital cities. It shows temperature, humidity,
 * wind details, weather description, and corresponding weather icons.
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';

// List of Australian capital cities
const AUSSIE_CAPITALS = [
    'Sydney',
    'Melbourne',
    'Brisbane',
    'Perth',
    'Adelaide',
    'Hobart',
    'Darwin',
    'Canberra',
];

// Backend API endpoint for fetching weather data
const BACKEND_WEATHER = 'http://weather-backend:8080/api/weather';

// Base URL for OpenWeather icons
const OPENWEATHER_ICON_URL = 'http://openweathermap.org/img/wn/';

const weatherColorMap = {
    Clear: 'bg-orange-400',      
    Clouds: 'bg-gray-400',     
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


export default function AussieCapitals() {
    const [citiesWeather, setCitiesWeather] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        /**
         * Fetches weather data for all Australian capitals.
         * Utilizes caching to minimize API requests and improve performance.
         */
        async function fetchAll() {
            // Check if weather data is cached in localStorage
            const cachedData = localStorage.getItem('aussieCapitalsWeather');
            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                // Define cache validity duration (e.g., 1 hour)
                const oneHour = 60 * 60 * 1000;
                if (new Date().getTime() - parsedData.timestamp < oneHour) {
                    setCitiesWeather(parsedData.data);
                    return;
                }
            }

            try {
                // Create an array of promises for fetching weather data concurrently
                const requests = AUSSIE_CAPITALS.map(city =>
                    axios.get(`${BACKEND_WEATHER}?city=${encodeURIComponent(city)}`)
                        .then(resp => ({ city, data: resp.data }))
                        .catch(err => ({ city, error: err }))
                );

                // Execute all requests concurrently
                const results = await Promise.all(requests);

                // Filter out successful results
                const successfulResults = results.filter(result => !result.error);
                setCitiesWeather(successfulResults);

                // Identify any failed requests
                const failedResults = results.filter(result => result.error);
                if (failedResults.length > 0) {
                    console.error('Some cities failed to fetch:', failedResults.map(r => r.city));
                    setError('Failed to load weather data for some cities.');
                }

                // Cache the successful results with a timestamp
                localStorage.setItem('aussieCapitalsWeather', JSON.stringify({
                    timestamp: new Date().getTime(),
                    data: successfulResults,
                }));
            } catch (err) {
                console.error('Aussie capitals fetch error:', err);
                setError('Failed to load Aussie capitals weather.');
            }
        }

        fetchAll();
    }, []);

    // Display error message if any
    if (error) {
        return <div className="text-red-500 mt-4">{error}</div>;
    }

    // Display loading indicator while data is being fetched
    if (!citiesWeather.length) {
        return <div className="text-gray-600 mt-4">Loading Aussie capitals weather...</div>;
    }

    return (
        <div className="mt-4 bg-white rounded shadow p-4">
            <h2 className="text-lg font-bold mb-2">Aussie Capitals Weather</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {citiesWeather.map(({ city, data }) => {
                    // 获取天气条件
                    const condition = data?.current?.weather?.[0]?.main || 'default';
                    const cardBgColor = weatherColorMap[condition] || weatherColorMap.default;

                    return (
                        <div 
                            key={city} 
                            className={`rounded p-4 shadow-md text-white ${cardBgColor} flex items-center`}
                        >
                            {/* 显示天气图标 */}
                            {data.current && data.current.weather && data.current.weather[0] && (
                                <div className="flex-shrink-0 w-8 h-8 bg-white/50 rounded-full shadow-lg flex items-center justify-center mr-4">
                                    <img
                                        src={`${OPENWEATHER_ICON_URL}${data.current.weather[0].icon}@2x.png`}
                                        alt={data.current.weather[0].description}
                                        className="w-4 h-4 drop-shadow-md"
                                    />
                                </div>
                            )}
                            {/* 显示天气信息 */}
                            <div>
                                <h3 className="font-bold text-lg">{city}</h3>
                                {data.current ? (
                                    <div className="space-y-1 mt-1">
                                        <p className="text-sm">
                                            <span className="font-semibold">Temp:</span> {data.current.temp} °C
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-semibold">Humidity:</span> {data.current.humidity}%
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-semibold">Wind:</span> {data.current.wind_speed} m/s {data.current.wind_deg}°
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-semibold">Weather:</span> {data.current.weather[0].description}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-100">No current data</p>
                                )}
                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    );
}
