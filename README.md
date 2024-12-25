# Weather App

This application showcases a **full-stack weather experience**. The frontend is built with **React** and **Tailwind CSS**, and the backend integrates **Google Maps Places API** for fuzzy searching alongside **OpenWeather** (geocoding + One Call 3.0) to retrieve actual weather data. A file-based **history** system preserves recent queries and relevant info (e.g., region/state, temperature, weather description).

---

## Key Features

1. **Google Maps Fuzzy Search**

   - As the user types a partial location, the app calls a **Places Autocomplete** endpoint (restricted to a chosen country, e.g. AU).
   - Suggestions appear in a dropdown, each containing a `place_id` and a descriptive label (e.g., “Point Cook 3030”).
   - On selecting a suggestion, the app fetches detailed weather data from OpenWeather.

2. **Dynamic Weather Background**

   - The main weather card changes its background image based on the current weather condition (e.g., `sunny.jpg`, `cloudy.jpg`, `rainy.jpg`).
   - These images are placed in the **`public/`** folder, so referencing them is as simple as `url('/filename.jpg')`.

3. **Region/State Extraction**

   - The backend geocodes the city or zip code, obtains `lat` and `lon`, and attempts to extract the **region/state** from the geocoding response.
   - This `region_name` is saved in the **history** and displayed to the user.

4. **File-Based Recent Searches**

   - Each time a user retrieves weather, a record is appended to a local JSON file (`history.json`), capturing query details such as:
     - `timestamp`
     - `query` (city or zip)
     - `region_name`
     - `current_temp`
     - `weather_description`
   - The **History** component pulls from this file (via the backend) and shows the **last 5** queries in chronological or reverse order.

5. **Weather Card**

   - Displays the location name, region/state, current temperature, and weather description.
   - If daily data exists, a small forecast section is shown.
   - Uses **Tailwind** classes for a neat, modern design, adding shadows and background overlays for readability.

6. **Aussie Capitals Weather (Optional)**

   - On app load, the app can automatically fetch weather for the **eight** major Australian capital cities (e.g., Sydney, Melbourne, Brisbane, Perth, Adelaide, Hobart, Darwin, Canberra).
   - Each city’s data is displayed in a simple grid with name, temperature, and description.

7. **Tailwind CSS**
   - All styling is handled via **Tailwind** utility classes, ensuring a responsive layout, consistent spacing/padding, and easily maintainable code.
   - Minimal or no custom CSS is needed.

---

## Tech Overview

- **Frontend**:

  - **React** for components and state management.
  - **Tailwind CSS** for styling (no extra manual CSS required).
  - **Axios** to communicate with the backend.

- **Backend**:
  - **Node.js + Express**.
  - **Google Maps Places API** for autocomplete (returns `place_id`).
  - **Place Details** API to parse `postal_code` or direct geocoding if needed.
  - **OpenWeather** (geocoding + One Call 3.0) to retrieve real-time weather.
  - **File-based storage** (`history.json`) for saving last queries.

---

## How It Works

1. **User Input**:

   - In the search bar, the user types a partial location. Autocomplete suggestions (fuzzy search) appear.

2. **Place Details & Weather**:

   - Upon selection, the backend calls Google Place Details (if `place_id` is used) to find the exact ZIP or lat/lon.
   - The backend calls OpenWeather geocoding + One Call with the resulting coordinates.

3. **History**:

   - The final weather data is saved to `history.json`, storing region/state, temperature, etc.

4. **Presentation**:
   - The main weather card is updated with location name, region, and current conditions. A dynamic background image appears based on the weather condition.
   - The last 5 searches are listed in a simple history view (region, temp, weather).

---

## Getting Started

1. **Backend Setup**

   - Ensure you have a valid **Google Maps API Key** (`GOOGLE_PLACES_API_KEY`) and an **OpenWeather Key** (`OPENWEATHER_API_KEY`).
   - Set them in a `.env` file (like `OPENWEATHER_API_KEY=YOUR_KEY`).
   - Run `npm install` and `node server.js` (or `npm start` if you have a script).

2. **Frontend Setup**

   - Confirm Tailwind is installed and configured (e.g., `@tailwind base; @tailwind components; @tailwind utilities;` in your main CSS).
   - `npm install` to install dependencies (React, Axios, etc.).
   - `npm start` to launch the dev server (default: `http://localhost:3000`).

3. **Demo**
   - In your browser, type partial location (“Point Cook”) → select from dropdown → see the background image and weather details.
   - Check the **Recent Searches** list for your last 5 queries.

---

## Future Enhancements

- **Units**: Add a toggle for metric/imperial.
- **More Conditions**: Extend background images for snow, haze, thunderstorm, etc.
- **Database Storage**: Replace file-based history with a real DB for multi-user usage.
- **Multi-day** or **hourly** forecast: Remove the `exclude` from the One Call request or parse `daily`/`hourly` fully for more detail.
- **Advanced Search**: Use place_id details to get more precise lat/lon for weather queries.

---

**Enjoy** your fully functional weather app with dynamic backgrounds, fuzzy search, region display, and a tidy Tailwind layout!
