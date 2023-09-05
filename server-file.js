const express = require('express');
const axios = require('axios');
const app = express();
const port = 4000;

app.use(express.json());

// Endpoint to get weather data by city name
app.get('/weather', async (req, res) => {
  const { cityName } = req.query;
  // Making sure the city name is encoded correctly
  const encodedCityName = encodeURIComponent(cityName); 

  try {
    // Use the geocode API to get coordinates from the city name
    const geocodeResponse = await axios.get(`https://geocode.maps.co/search?q=${encodedCityName}`);
    
    // Check if the response contains coordinates
    if (geocodeResponse.data && geocodeResponse.data.length > 0) {
      const firstResult = geocodeResponse.data[0];
      const latitude = firstResult.lat;
      const longitude = firstResult.lon;

      // Fetch weather data from Open Meteo API using the coordinates
      const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain&timezone=auto`);
      res.status(404).json({ error: 'City not found', geocodeResponse: geocodeResponse.data });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch weather data' }); // Check on server error
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Server-file.js console message
});



