import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HISTORY_URL = 'http://54.206.9.239:8080/api/history';

/**
 * HistoryList Component
 *
 * Displays the most recent 5 search history records, including details like suburb,
 * state, temperature, weather description, humidity, and wind speed.
 * Fetches data from the backend API and caches it in the component state.
 */
export default function HistoryList() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(HISTORY_URL)
      .then((res) => {
        const last5 = res.data.slice(-5).reverse(); // Get the latest 5 records
        setRecords(last5);
      })
      .catch((err) => {
        console.error('History fetch error:', err);
        setError('Failed to load history');
      });
  }, []);

  if (error) {
    return <div className="text-red-500 mt-4">{error}</div>;
  }

  if (records.length === 0) {
    return <div className="mt-4 text-gray-600">No recent searches.</div>;
  }

  return (
    <div className="mt-4 p-4 border rounded bg-white shadow">
      <h2 className="text-lg font-bold mb-2">Recent Searches (Last 5)</h2>
      <ul className="space-y-3">
        {records.map((item, idx) => (
          <li
            key={idx}
            className="p-3 border rounded shadow-sm flex items-center space-x-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {/* Left section: Icon representing the search query */}
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              {item.suburb[0].toUpperCase()}
            </div>
            {/* Right section: Details about the search */}
            <div>
              {item.suburb && (
                <p className="text-xs text-gray-800">
                  <span className="font-semibold">Suburb:</span> {item.suburb}
                </p>
              )}
              {item.state && (
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">State:</span> {item.state}
                </p>
              )}
              <p className="text-xs text-gray-600">
                {item.current_temp != null && (
                  <span className="mr-2">
                    <span className="font-semibold">Temp:</span> {item.current_temp} °C
                  </span>
                )}
                {item.weather_description && (
                  <span className="mr-2">
                    <span className="font-semibold">Weather:</span> {item.weather_description}
                  </span>
                )}
                {item.humidity != null && (
                  <span className="mr-2">
                    <span className="font-semibold">Humidity:</span> {item.humidity}%
                  </span>
                )}
                {item.wind_speed != null && (
                  <span>
                    <span className="font-semibold">Wind Speed:</span> {item.wind_speed} m/s
                  </span>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
