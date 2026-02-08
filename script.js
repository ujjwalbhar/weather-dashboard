// OpenWeatherMap API - Note: Use your own API key
const API_KEY = 'demo'; // Replace with your API key from openweathermap.org
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

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
    
    // Demo mode - showing sample data
    setTimeout(() => {
        showDemoWeather(city);
    }, 500);
    
    // To use real API, uncomment below and comment out the demo code above:
    /*
    fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => displayWeather(data))
        .catch(error => showError(error.message));
    */
}

function showDemoWeather(city) {
    const demoData = {
        name: city,
        main: {
            temp: 25,
            feels_like: 24,
            humidity: 65,
            pressure: 1013
        },
        weather: [{
            description: 'partly cloudy',
            main: 'Clouds'
        }],
        wind: {
            speed: 3.5
        }
    };
    displayWeather(demoData);
}

function displayWeather(data) {
    const html = `
        <div class="weather-info">
            <h2 class="city-name">${data.name}</h2>
            <div class="temperature">${Math.round(data.main.temp)}°C</div>
            <div class="description">${data.weather[0].description}</div>
            <div class="details">
                <div class="detail-item">
                    <strong>Feels Like</strong>
                    ${Math.round(data.main.feels_like)}°C
                </div>
                <div class="detail-item">
                    <strong>Humidity</strong>
                    ${data.main.humidity}%
                </div>
                <div class="detail-item">
                    <strong>Wind Speed</strong>
                    ${data.wind.speed} m/s
                </div>
                <div class="detail-item">
                    <strong>Pressure</strong>
                    ${data.main.pressure} hPa
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
