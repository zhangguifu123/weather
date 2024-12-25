import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AUTOCOMPLETE_URL = 'http://localhost:8080/api/maps/autocomplete';
const PLACE_SELECT_URL = 'http://localhost:8080/api/maps/select';

export default function SearchBar({ onWeatherFetched }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);

  // Fetch fuzzy suggestions from /api/maps/autocomplete
  const fetchAutocomplete = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const resp = await axios.get(`${AUTOCOMPLETE_URL}?input=${encodeURIComponent(query)}`);
      setSuggestions(resp.data);
    } catch (err) {
      console.error('Autocomplete error:', err);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setError(null);
    setShowDropdown(true);

    if (val.trim()) {
      fetchAutocomplete(val.trim());
    } else {
      setSuggestions([]);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutsideClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // When user selects a suggestion
  const handleSelect = async (suggestion) => {
    setInputValue(suggestion.description);
    setShowDropdown(false);
    setSuggestions([]);

    try {
      setError(null);
      const url = `${PLACE_SELECT_URL}?place_id=${encodeURIComponent(suggestion.place_id)}`;
      const resp = await axios.get(url);
      onWeatherFetched?.(resp.data);
    } catch (err) {
      console.error('Place select error:', err);
      setError(err.response?.data?.error || 'Failed to fetch weather');
    }
  };

  return (
    <div className="relative w-full max-w-sm" ref={containerRef}>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded focus:outline-none"
        placeholder="Start typing location..."
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
              {item.description}
            </div>
          ))}
        </div>
      )}
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}
