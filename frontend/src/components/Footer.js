

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleFooter = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <footer className="bg-gray-900 text-white py-1 transition-all duration-500 ease-in-out relative">
      <div className="container mx-auto px-6">
        {/* Compact Footer Content with "Visit Again" centered both horizontally and vertically */}
        <div className="flex justify-center items-center h-6">
          <p className="text-md font-semibold items-center text-center  cursor-pointer" onClick={toggleFooter}>
            Visit Again
          </p>
        </div>

        {/* Show More Button aligned to the right for desktop */}
        <div className="absolute right-6 top-3 md:block hidden">
          <button
            onClick={toggleFooter}
            className="mt-3 text-xs text-gray-400 hover:text-white transition-transform duration-300 transform hover:scale-110"
          >
            {isExpanded ? "Less" : "More.."}
          </button>
        </div>

        {/* Expanded Footer Content */}
        <div
          className={`mt-6 space-y-3 transition-all duration-500 ease-in-out ${
            isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Company Info */}
            <div>
              <h3 className="text-sm font-semibold mb-2">CarXpert 360</h3>
              <p className="text-xs text-gray-400">
                Quality products at unbeatable prices!
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Quick Links</h3>
              <ul className="text-xs">
                <li className="mb-1">
                  <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
                </li>
                <li className="mb-1">
                  <Link to="/towingservice" className="text-gray-400 hover:text-white">Towing Services</Link>
                </li>
                <li className="mb-1">
                  <Link to="/damagedetector" className="text-gray-400 hover:text-white">Damage Analyser</Link>
                </li>
                <li className="mb-1">
                  <Link to="/about" className="text-gray-400 hover:text-white">About Us</Link>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="sm:col-span-2">
              <h3 className="text-sm font-semibold mb-2">Follow Us</h3>
              <div className="flex justify-center space-x-4 text-xl">
                <a href="https://linkedin.com/in/adarsh-kasireddy-0719ka" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} CarXpert 360. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
