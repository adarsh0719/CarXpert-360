require("dotenv").config();
const axios = require("axios");
const ORS_API_KEY = process.env.ORS_API_KEY; // Ensure API key is stored securely in environment variables
// Fixed towing destination cities in India
const destinations = [
    { city: "Mumbai", lat: 19.0760, lon: 72.8777 },
    { city: "Delhi", lat: 28.7041, lon: 77.1025 },
    { city: "Pune", lat: 18.5204, lon: 73.8567 },
    { city: "Hyderabad", lat: 17.3850, lon: 78.4867 },
    { city: "Visakhapatnam", lat: 17.6868, lon: 83.2185 },
    { city: "Chennai", lat: 13.0827, lon: 80.2707 },
    { city: "Bangalore", lat: 12.9716, lon: 77.5946 },
    { city: "Kolkata", lat: 22.5726, lon: 88.3639 },
    { city: "Nagpur", lat: 21.1458, lon: 79.0882 }
];

// Haversine formula to calculate shortest distance
const haversine = (lat1, lon1, lat2, lon2) => {
    const toRad = angle => (angle * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getNearestCityAndRoute = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        if (!latitude || !longitude) {
            return res.status(400).json({ error: "Coordinates required!" });
        }

        let nearestCity = null;
        let minDistance = Infinity;
        let destinationCoords = {};

        destinations.forEach(dest => {
            const distance = haversine(latitude, longitude, dest.lat, dest.lon);
            if (distance < minDistance) {
                minDistance = distance;
                nearestCity = dest.city;
                destinationCoords = { lat: dest.lat, lon: dest.lon };
            }
        });

        const orsResponse = await axios.post(
            "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
            {
                coordinates: [[longitude, latitude], [destinationCoords.lon, destinationCoords.lat]],
                instructions: false
            },
            { headers: { Authorization: `Bearer ${ORS_API_KEY}`, "Content-Type": "application/json" } }
        );

        res.json({
            nearestCity,
            distance: minDistance.toFixed(2),
            route: orsResponse.data.features[0].geometry.coordinates.map(([lon, lat]) => [lat, lon])
        });
    } catch (error) {
        console.error("Error fetching route:", error);
        res.status(500).json({ error: "Failed to get route." });
    }
};

module.exports = getNearestCityAndRoute;
