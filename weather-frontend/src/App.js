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
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Google Maps + OpenWeather Demo</h1>
        <SearchBar onWeatherFetched={setWeatherData} />
        <WeatherDisplay data={weatherData} />
        <HistoryList />
        <AussieCapitals />
      </div>
    </div>
  );
}
