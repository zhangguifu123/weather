import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const AUTOCOMPLETE_URL = 'http://localhost:8080/api/maps/autocomplete';
const WEATHER_URL = 'http://localhost:8080/api/weather';

export default function SearchBar({ onWeatherFetched }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);

  // Fetch autocomplete suggestions
  const fetchAutocomplete = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const resp = await axios.get(`${AUTOCOMPLETE_URL}?input=${encodeURIComponent(query)}`);
      setSuggestions(resp.data); // [{ description, place_id, suburb, city, postcode }]
    } catch (err) {
      console.error('Autocomplete error:', err);
      setError('Failed to fetch suggestions');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowDropdown(true);
    setError(null);

    if (value.trim()) {
      fetchAutocomplete(value.trim());
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSelect = async (suggestion) => {
    setInputValue(suggestion.description);
    setShowDropdown(false);
    setSuggestions([]);

    // Extract information from the selected suggestion
    const { suburb, city, postcode } = suggestion;

    try {
      setError(null);

      // Determine parameters to send to the weather API
      let weatherParams = {};
      if (suburb) {
        weatherParams = { suburb };
      } else if (postcode) {
        weatherParams = { postcode };
      } else if (city) {
        weatherParams = { city };
      } else {
        setError('Unable to determine location details');
        return;
      }

      // Fetch weather data
      const resp = await axios.get(`${WEATHER_URL}`, { params: weatherParams });
      onWeatherFetched?.(resp.data); // Pass the fetched weather data back to the parent
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Failed to fetch weather data');
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded focus:outline-none"
        placeholder="Search location..."
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setShowDropdown(true)}
      />
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-10 bg-white border border-gray-200 rounded w-full mt-1 shadow">
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              <div>{item.description}</div>
              <div className="text-sm text-gray-500">
                {item.suburb || 'N/A'}, {item.city || 'N/A'}, {item.postcode || 'N/A'}
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}
