import React, { useState, useEffect } from "react";
import SummaryApi from '../common';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import TowingOrder from "./TowingOrder";

const locationIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -20]
});

function FitBounds({ route }) {
    const map = useMap();
    useEffect(() => {
        if (route.length > 1) {
            map.fitBounds(route, { padding: [80, 80] });
        }
    }, [route, map]);
    return null;
}

function NearestTracker() {
    const [location, setLocation] = useState(null);
    const [nearestCity, setNearestCity] = useState(null);
    const [route, setRoute] = useState([]);
    const [estimatedTime, setEstimatedTime] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const getNearestTracker = async () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setIsLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation([latitude, longitude]);

                try {
                    const response = await fetch(SummaryApi.tracker.url, {
                        method: SummaryApi.tracker.method,
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ latitude, longitude })
                    });

                    const responseData = await response.json();

                    if (responseData) {
                        const { nearestCity, distance, route } = responseData;
                        setNearestCity({ name: nearestCity, distance });
                        setRoute(route);
                        setMapLoaded(true);
                        
                        const timeInHours = distance / 48;
                        const hours = Math.floor(timeInHours);
                        const minutes = Math.round((timeInHours - hours) * 60);
                        setEstimatedTime(`${hours} hr ${minutes} min`);
                    }
                } catch (error) {
                    console.error("Error fetching route:", error);
                } finally {
                    setIsLoading(false);
                }
            },
            (error) => {
                alert("Error fetching location: " + error.message);
                setIsLoading(false);
            }
        );
    };

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = ((e.clientX - left) / width - 0.5) * 15;
        const y = ((e.clientY - top) / height - 0.5) * -15;
        setRotateX(y);
        setRotateY(x);
    };

    const resetTransform = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <div style={{ 
            textAlign: "center", 
            marginTop: "20px", 
            fontFamily: "'Playfair Display', serif",
            padding: "0 15px"
        }}>
            <h1 style={{ 
                fontSize: "clamp(1.8rem, 6vw, 2.5rem)", 
                marginBottom: "30px",
                lineHeight: "1.2"
            }}>Towing Service</h1>

            <div style={{ 
                display: "flex", 
                justifyContent: "flex-end", 
                marginRight: "1%",
                marginBottom: "20px"
            }}>
                <button
                    onClick={getNearestTracker}
                    style={{
                        background: "black",
                        color: "white",
                        padding: "12px 20px",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "clamp(0.9rem, 3vw, 1rem)",
                        cursor: "pointer",
                        position: "relative",
                        overflow: "hidden",
                        zIndex: 0,
                        transition: "color 0.3s ease",
                        boxShadow: "0 0 10px #FF0000, 0 0 20px #FF7300, 0 0 30px #FFFB00, 0 0 40px #48FF00"
                    }}
                >
                    Get Nearest Service Center
                    <div
                        style={{
                            content: '""',
                            position: "absolute",
                            top: "-2px",
                            left: "-2px",
                            width: "calc(100% + 4px)",
                            height: "calc(100% + 4px)",
                            borderRadius: "10px",
                            background: "linear-gradient(45deg, #FF0000, #FF7300, #FFFB00, #48FF00, #00FFD5, #002BFF, #FF00C8, #FF0000)",
                            backgroundSize: "600%",
                            zIndex: -1,
                            filter: "blur(8px)",
                            animation: "glowing 20s linear infinite"
                        }}
                    />
                </button>
            </div>

            {isLoading && (
                <div style={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    margin: "40px 0"
                }}>
                    <div className="spinner"></div>
                </div>
            )}

            {location && nearestCity && mapLoaded && !isLoading && (
                <div style={{
                    display: "flex",
                    flexDirection: window.innerWidth > 768 ? "row" : "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "30px",
                    marginTop: "20px",
                    padding: "0 5%"
                }}>
                    <div style={{
                        width: window.innerWidth > 768 ? "55vw" : "100%",
                        height: "50vh",
                        minWidth: "300px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                        position:"relative",
                        zIndex: 1
                    }}>
                        <MapContainer
                            style={{ width: "100%", height: "100%" }}
                            zoom={10}
                            dragging={false}
                            zoomControl={false}
                            doubleClickZoom={false}
                            scrollWheelZoom={false}
                            touchZoom={false}
                            
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <FitBounds route={route} />

                            <Marker position={location} icon={locationIcon}>
                                <Popup>Your Location</Popup>
                            </Marker>

                            {route.length > 1 && (
                                <Marker position={route[route.length - 1]} icon={locationIcon}>
                                    <Popup>{nearestCity.name} (Destination)</Popup>
                                </Marker>
                            )}

                            {route.length > 1 && (
                                <Polyline positions={route} color="blue" weight={3} opacity={0.8} />
                            )}
                        </MapContainer>
                    </div>

                    <div 
                        style={{
                            width: "100%",
                            maxWidth: "400px",
                            padding: "25px",
                            borderRadius: "10px",
                            backgroundColor: "maroon",
                            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            transform: window.innerWidth > 768 ? 
                                `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` : "none",
                            transition: "transform 0.08s ease-out"
                        }}
                        onMouseMove={handleMouseMove}
                        >
                        <h3 style={{ fontSize: "clamp(1rem, 4vw, 1.25rem)" }}>Nearest City: {nearestCity.name}</h3>
                        <p style={{ fontSize: "clamp(1rem, 4vw, 1.25rem)" }}><strong>Distance:</strong> {nearestCity.distance} km</p>
                        <p style={{ fontSize: "clamp(1rem, 4vw, 1.25rem)" }}>🕒 <strong>Estimated Time:</strong> {estimatedTime}</p>
                    </div>
                </div>
            )}

            {location && nearestCity?.distance !== undefined && !isLoading && (
                <TowingOrder distance={nearestCity.distance} />
            )}

            <style>
                {`
                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid rgba(0, 0, 0, 0.1);
                    border-top-color: maroon;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @media (max-width: 768px) {
                    .map-container {
                        height: 300px !important;
                    }
                    .info-card {
                        width: 100% !important;
                        max-width: none !important;
                    }
                }
                `}
            </style>
        </div>
    );
}

export default NearestTracker;