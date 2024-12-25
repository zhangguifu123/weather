import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HISTORY_URL = 'http://localhost:8080/api/history';

export default function HistoryList() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(HISTORY_URL)
      .then((res) => {
        // Show only last 5
        const last5 = res.data.slice(-5);
        // Reverse if you want newest first:
        setRecords(last5.reverse());
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
      <ul className="space-y-1">
        {records.map((item, idx) => (
          <li key={idx} className="text-sm text-gray-700">
            <span className="font-semibold">{item.query}</span>
            {item.region_name && <> | Region: {item.region_name}</>}
            {item.current_temp != null && (
              <> | Temp: {item.current_temp} K </>
            )}
            {item.weather_description && <> | {item.weather_description}</>}
          </li>
        ))}
      </ul>
    </div>
  );
}
