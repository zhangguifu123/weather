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
const BACKEND_WEATHER = 'http://54.206.9.239:8080/api/weather'; // Replace localhost with the backend's public IP

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
        async function fetchAll() {
            console.log('Starting fetchAll');
            try {
                const requests = AUSSIE_CAPITALS.map(city =>
                    axios
                        .get(`${BACKEND_WEATHER}?city=${encodeURIComponent(city)}`)
                        .then(resp => {
                            console.log(`Success for ${city}:`, resp.data);
                            return { city, data: resp.data };
                        })
                        .catch(err => {
                            console.error(`Error for ${city}:`, err);
                            return { city, error: err };
                        })
                );
    
                const results = await Promise.all(requests);
                console.log('Fetch results:', results);
    
                const successfulResults = results.filter(r => !r.error);
                setCitiesWeather(successfulResults);
    
                if (successfulResults.length === 0) {
                    setError('Failed to fetch weather data for all cities.');
                }
            } catch (err) {
                console.error('General fetch error:', err);
                setError('Failed to load Aussie capitals weather.');
            }
        }
    
        fetchAll(); // Call the function on component mount
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
                {citiesWeather.map(({ city, data }) => {
                    const condition = data?.current?.weather?.[0]?.main || 'default'; // Weather condition
                    const cardBgColor = weatherColorMap[condition] || weatherColorMap.default; // Card background color

                    return (
                        <div
                            key={city}
                            className={`rounded p-4 shadow-md text-white ${cardBgColor} flex items-center`}
                        >
                            {/* Weather icon */}
                            {data.current?.weather?.[0] && (
                                <div className="flex-shrink-0 w-8 h-8 bg-white/50 rounded-full shadow-lg flex items-center justify-center mr-4">
                                    <img
                                        src={`${OPENWEATHER_ICON_URL}${data.current.weather[0].icon}@2x.png`}
                                        alt={data.current.weather[0].description}
                                        className="w-4 h-4 drop-shadow-md"
                                    />
                                </div>
                            )}
                            {/* Weather details */}
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
