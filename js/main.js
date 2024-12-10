
async function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = '88fe6d684ad0472db54164026240912'; 
            const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                displayWeather(data);
            } catch (error) {
                console.error('Error fetching weather data:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'An error occurred while fetching weather data',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }, (error) => {
            console.error('Error getting location:', error);
            Swal.fire({
                title: 'Error',
                text: 'An error occurred while getting location',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Browser does not support geolocation',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

async function getWeather() {
    const location = document.getElementById('location-input').value;
    const apiKey = '88fe6d684ad0472db54164026240912';
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        Swal.fire({
            title: 'Error',
            text: 'An error occurred while fetching weather data',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

function displayWeather(data) {
    const weatherContainer = document.getElementById('weather-container');
    weatherContainer.innerHTML = '';

    if (!data.forecast || data.forecast.forecastday.length === 0) {
        weatherContainer.innerHTML = '<p>No weather data available.</p>';
        return;
    }

    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);
        let weatherIcon = '';

        if (day.day.condition.text.includes('Sunny')) {
            weatherIcon = '<i class="fas fa-sun weather-icon"></i>';
        } else if (day.day.condition.text.includes('Cloudy')) {
            weatherIcon = '<i class="fas fa-cloud weather-icon"></i>';
        } else if (day.day.condition.text.includes('Rain')) {
            weatherIcon = '<i class="fas fa-cloud-showers-heavy weather-icon"></i>';
        }

        const weatherCard = `
            <div class="col-md-4 weather-card">
                ${weatherIcon}
                <h1>${date.toDateString()}</h1>
                <h2>${data.location.name}</h2>
                <p>${day.day.condition.text}</p>
                <p>${day.day.avgtemp_c}°C</p>
                <p>${day.day.avghumidity}%</p>
            </div>
        `;
        weatherContainer.innerHTML += weatherCard;
    });
}
