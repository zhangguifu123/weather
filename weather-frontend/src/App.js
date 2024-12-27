// App.js
import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import HistoryList from './components/HistoryList';
import AussieCapitals from './components/AussieCapitals';
export default function App() {
  const [weatherData, setWeatherData] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div class="w-full max-w-lg border border-gray-200 rounded-lg shadow-lg p-4 bg-gradient-to-br from-white to-gray-50">
        <h1 className="text-2xl font-bold mb-4">Google Maps + OpenWeather Demo</h1>
        <SearchBar onWeatherFetched={setWeatherData} />
        <WeatherDisplay data={weatherData} />
        <HistoryList />
        <AussieCapitals />
      </div>
    </div>
  );
}
