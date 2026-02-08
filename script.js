const cityInput = document.getElementById('cityInput');
const weatherDisplay = document.getElementById('weatherDisplay');

// Allow Enter key to trigger search
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

function getWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    showLoading();
    
    // Using Open-Meteo API (free, no API key required)
    // First get coordinates for the city using geocoding API
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`)
        .then(response => response.json())
        .then(data => {
            if (!data.results || data.results.length === 0) {
                throw new Error('City not found');
            }
            
            const location = data.results[0];
            const lat = location.latitude;
            const lon = location.longitude;
            const cityName = location.name;
            const country = location.country;
            
            // Now get weather data
            return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure&timezone=auto`)
                .then(response => response.json())
                .then(weatherData => {
                    displayWeather({
                        name: `${cityName}, ${country}`,
                        current: weatherData.current
                    });
                });
        })
        .catch(error => {
            showError(error.message || 'Failed to fetch weather data');
        });
}

function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    return descriptions[code] || 'Unknown';
}

function displayWeather(data) {
    const current = data.current;
    const temp = Math.round(current.temperature_2m);
    const feelsLike = Math.round(current.apparent_temperature);
    const humidity = current.relative_humidity_2m;
    const windSpeed = current.wind_speed_10m;
    const pressure = current.surface_pressure;
    const description = getWeatherDescription(current.weather_code);
    
    const html = `
        <div class="weather-info">
            <h2 class="city-name">${data.name}</h2>
            <div class="temperature">${temp}°C</div>
            <div class="description">${description}</div>
            <div class="details">
                <div class="detail-item">
                    <strong>Feels Like</strong>
                    ${feelsLike}°C
                </div>
                <div class="detail-item">
                    <strong>Humidity</strong>
                    ${humidity}%
                </div>
                <div class="detail-item">
                    <strong>Wind Speed</strong>
                    ${windSpeed} km/h
                </div>
                <div class="detail-item">
                    <strong>Pressure</strong>
                    ${Math.round(pressure)} hPa
                </div>
            </div>
        </div>
    `;
    weatherDisplay.innerHTML = html;
}

function showLoading() {
    weatherDisplay.innerHTML = '<div class="loading">Loading weather data...</div>';
}

function showError(message) {
    weatherDisplay.innerHTML = `<div class="error">${message}</div>`;
}
