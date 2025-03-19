import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FaTags } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { GiCheckMark } from "react-icons/gi";
import backgroundImage from "../assest/towing.webp";
import ServiceLocations from "./ServiceLocations";
import NearestTracker from "./NearestTracker";
import TowingOrder from "./TowingOrder";

const features = [
  {
    icon: <FaTags className="text-4xl sm:text-5xl mb-3" />,
    title: "Free Quote",
    description: "We offer Top-Quality Services at the most Competitive Rates. Call us to get a Free Quote.",
  },
  {
    icon: <MdVerified className="text-4xl sm:text-5xl mb-3" />,
    title: "Trusted",
    description: "100% Safety and Trusted top-class Car Towing Services in All-over India.",
  },
  {
    icon: <GiCheckMark className="text-4xl sm:text-5xl mb-3" />,
    title: "Guarantee",
    description: "24x7x365 days Car Towing / RSA Services in All-over India.",
  },
];

const TowingsService = () => {
  // Ref for NearestTracker section
  const trackerRef = useRef(null);

  // Function to scroll to NearestTracker
  const handleScrollToTracker = () => {
    trackerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="mt-[-24px]">
        {/* Hero Section */}
        <div
          className="relative w-full h-[80vh] sm:h-screen bg-cover bg-center px-4 flex flex-col justify-center items-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center">
            <motion.h1
              className="text-white text-2xl sm:text-4xl font-playfair font-bold"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              24/7 Towing Service & Roadside Assistance
            </motion.h1>

            <motion.button
              className="mt-7 px-4 sm:px-6 py-2 sm:py-3 bg-white text-black text-sm sm:text-lg font-semibold rounded-full shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScrollToTracker} // Scroll on click
            >
              Book Now
            </motion.button>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-blue-500 text-white py-10 px-4 sm:px-6 md:px-0">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-6 rounded-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                {feature.icon}
                <h3 className="text-lg sm:text-xl font-bold">{feature.title}</h3>
                <p className="text-sm sm:text-base mt-2">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Locations Section */}
      <div ref={trackerRef}> {/* Add ref to track scrolling */}  
        <NearestTracker />
      </div>
      <ServiceLocations />
    </>
  );
};

export default TowingsService;
