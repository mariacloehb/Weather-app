document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('cityInput');
    const searchButton = document.getElementById('searchButton');
    const cityNameDisplay = document.getElementById('cityName');
    const temperatureDisplay = document.getElementById('temperature');
    const rainDisplay = document.getElementById('rain');

    //Getting coordinates from GeoLocation API
    async function getCoordinates(cityName) {
        try {
            const response = await fetch(`https://geocode.maps.co/search?q=${encodeURIComponent(cityName)}`);
            const data = await response.json();

            if (response.status === 200 && data && data[0] && data[0].lat && data[0].lon) {
                const latitude = data[0].lat;
                const longitude = data[0].lon;

                getWeatherData(cityName, latitude, longitude);
            } else {
                cityNameDisplay.textContent = '';
                temperatureDisplay.textContent = '';
                rainDisplay.textContent = 'City not found'; //Check for errors
            }
        } catch (error) {
            console.error(error);
            cityNameDisplay.textContent = '';
            temperatureDisplay.textContent = '';
            rainDisplay.textContent = 'Error fetching data'; //Check for errors
        }
    }

    // Getting weather information based on coordinates
    async function getWeatherData(cityName, latitude, longitude) {
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain&timezone=auto`);
            const data = await response.json();

            if (response.status === 200) {
                cityNameDisplay.textContent = cityName;
                temperatureDisplay.textContent = data.hourly.temperature_2m + "°C";
                rainDisplay.textContent = data.hourly.rain + " mm";
            } else {
                cityNameDisplay.textContent = '';
                temperatureDisplay.textContent = '';
                rainDisplay.textContent = 'Weather data not available';
            }
        } catch (error) {
            console.error(error);
            cityNameDisplay.textContent = '';
            temperatureDisplay.textContent = '';
            rainDisplay.textContent = 'Error fetching data';
        }
    }

    // Search button configuration
    searchButton.addEventListener('click', () => {
        const cityName = cityInput.value;
        getCoordinates(cityName);
    });

    // Second option to press enter instead of button
    cityInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const cityName = cityInput.value;
            getCoordinates(cityName);
        }
    });
});
