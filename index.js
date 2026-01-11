const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Flight Tracker API is running ✈️');
});

// Endpoint to get live flights from OpenSky Network
app.get('/api/flights', async (req, res) => {
  try {
    // Bounding box for Europe (approx)
    const lamin = 35.0;
    const lomin = -10.0;
    const lamax = 70.0;
    const lomax = 40.0;
    
    const response = await axios.get(
      https://opensky-network.org/api/states/all?lamin={lamin}&lomin={lomin}&lamax={lamax}&lomax={lomax}
    );
    
    const flights = response.data.states.map(state => ({
      icao24: state[0],
      callsign: state[1].trim(),
      origin_country: state[2],
      longitude: state[5],
      latitude: state[6],
      baro_altitude: state[7],
      on_ground: state[8],
      velocity: state[9],
      true_track: state[10],
      vertical_rate: state[11]
    })).slice(0, 100); // Limit to 100 for demo

    res.json({ count: flights.length, data: flights });
  } catch (error) {
    console.error('Error fetching flight data:', error.message);
    // Fallback mock data if API fails (e.g. rate limit)
    res.json({
      message: 'Live data unavailable, showing mock data',
      data: [
        {
          icao24: 'a00001',
          callsign: 'MOCK01',
          origin_country: 'United States',
          longitude: -0.1278,
          latitude: 51.5074,
          baro_altitude: 10000,
          on_ground: false,
          velocity: 250,
          true_track: 90,
          vertical_rate: 0
        }
      ]
    });
  }
});

app.listen(port, () => {
  console.log(Server listening at http://localhost:{port});
});
