import React from 'react';

function getBackgroundImage(condition) {
  if (!condition) return 'default.jpg';
  const main = condition.toLowerCase();
  if (main === 'clear') return 'sunny.jpg';
  if (main === 'clouds') return 'cloudy.jpg';
  if (main.includes('rain')) return 'rainy.jpg';
  return 'default.jpg';
}

export default function WeatherDisplay({ data }) {
  if (!data) {
    return <div className="mt-4 text-gray-600">No weather data yet.</div>;
  }

  const { location, current, daily, region } = data;
  const condition = current?.weather?.[0]?.main;
  const bgImage = getBackgroundImage(condition);

  return (
    <div
      className="mt-4 p-4 border rounded shadow-lg text-white"
      style={{
        backgroundImage: `url('/${bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h2 className="text-2xl font-bold mb-2">{location || 'Unknown Location'}</h2>
      {region && (
        <p className="text-sm mb-2">
          Region: {region}
        </p>
      )}
      {current ? (
        <div>
          <p className="text-sm">
            Current Temp: <span className="font-semibold">{current.temp} K</span>
          </p>
          <p className="text-sm">
            Weather: {current.weather?.[0]?.description}
          </p>
        </div>
      ) : (
        <p>No current data.</p>
      )}

      {daily && daily.length > 0 && (
        <div className="mt-4 bg-black bg-opacity-40 p-2 rounded">
          <h3 className="text-lg font-semibold mb-2">Daily Forecast:</h3>
          {daily.map((day, idx) => (
            <div key={idx} className="text-sm mb-1">
              Day {idx + 1}: {day.temp?.day} K - {day.weather?.[0]?.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
