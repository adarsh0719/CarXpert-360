import React from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const locations = [
  {
    city: "Delhi",
    address:
      "Connaught Place, Block A, 2nd Floor, Near Rajiv Chowk Metro Station, New Delhi",
    rating: 4.5,
  },
  {
    city: "Mumbai",
    address:
      "Bandra West, Linking Road, 3rd Floor, Opposite National College, Mumbai",
    rating: 4.3,
  },
  {
    city: "Chennai",
    address:
      "T Nagar, Ranganathan Street, Ground Floor, Near Pondy Bazaar, Chennai",
    rating: 4.7,
  },
  {
    city: "Bangalore",
    address:
      "Indiranagar, 100 Feet Road, 1st Floor, Near CMH Road Metro, Bangalore",
    rating: 4.2,
  },
  {
    city: "Hyderabad",
    address:
      "Madhapur, Hitech City Road, 2nd Floor, Opposite Cyber Towers, Hyderabad",
    rating: 4.6,
  },
  {
    city: "Visakhapatnam",
    address:
      "Dwaraka Nagar, 4th Lane, Near RTC Complex, Opposite Diamond Park, Visakhapatnam",
    rating: 4.3,
  },
  {
    city: "Kolkata",
    address:
      "Park Street, Camac Street, 5th Floor, Near Quest Mall, Kolkata",
    rating: 4.4,
  },
  {
    city: "Nagpur",
    address:
      "Patil Complex, 7-A, Ground Floor, Opposite Rahul Hotel, Ganeshpeth, Nagpur",
    rating: 4.2,
  },
];

const serviceLocations = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Our Locations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location, index) => (
          <motion.div
            key={index}
            className="border p-5 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{location.city}</h3>
              <div className="flex items-center bg-green-200 px-2 py-1 rounded-md">
                <FaStar className="text-yellow-500" />
                <span className="ml-1 font-semibold">{location.rating}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{location.address}</p>
            <a href="#" className="text-blue-600 text-sm mt-3 inline-block">
              View office location
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default serviceLocations;
