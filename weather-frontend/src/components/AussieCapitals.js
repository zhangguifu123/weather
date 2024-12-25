import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Aussie capitals (you can adjust if you like)
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

const BACKEND_WEATHER = 'http://localhost:8080/api/weather';

export default function AussieCapitals() {
  const [citiesWeather, setCitiesWeather] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const results = [];
        for (const city of AUSSIE_CAPITALS) {
          const resp = await axios.get(`${BACKEND_WEATHER}?city=${encodeURIComponent(city)}`);
          results.push({ city, data: resp.data });
        }
        setCitiesWeather(results);
      } catch (err) {
        console.error('Aussie capitals fetch error:', err);
        setError('Failed to load Aussie capitals weather');
      }
    }
    fetchAll();
  }, []);

  if (error) {
    return <div className="text-red-500 mt-4">{error}</div>;
  }

  // If not loaded yet, you could show a loader
  if (!citiesWeather.length) {
    return <div className="text-gray-600 mt-4">Loading Aussie capitals weather...</div>;
  }

  return (
    <div className="mt-4 bg-white rounded shadow p-4">
      <h2 className="text-lg font-bold mb-2">Aussie Capitals Weather</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {citiesWeather.map(({ city, data }) => (
          <div key={city} className="border rounded p-2 bg-gray-50">
            <h3 className="font-semibold mb-1">{city}</h3>
            {data.current ? (
              <p className="text-sm text-gray-700">
                {data.current.temp} K - {data.current.weather?.[0]?.description}
              </p>
            ) : (
              <p className="text-sm text-gray-500">No current data</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
