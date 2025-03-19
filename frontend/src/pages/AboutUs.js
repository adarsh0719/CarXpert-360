import React from "react";

const AboutUs = () => {
  return (
    <div className="flex flex-col  mt-[-20pt] items-center justify-center px-6 py-12 bg-gradient-to-r from-[#E3C6A0] to-[#D2B48C] min-h-screen text-white">
      <div className="max-w-5xl text-center bg-white p-12 rounded-lg shadow-2xl text-gray-900">
        <h1 className="text-4xl font-extrabold mb-6 text-indigo-700">About Us</h1>
        <p className="text-lg leading-relaxed mb-6">
          Welcome to <span className="font-semibold text-red-600">CarFix 360</span>, your trusted destination for premium car accessories, AI-driven vehicle diagnostics, and efficient towing services. We blend technology and convenience to ensure seamless vehicle management for car owners.
        </p>

        <h2 className="text-3xl font-semibold text-gray-800 mt-8">Our Mission</h2>
        <p className="text-lg text-gray-700 mt-2">
          At <span className="font-bold text-indigo-600">CarFix 360</span>, we aim to redefine the automotive service industry by integrating cutting-edge AI solutions, making car maintenance effortless, accurate, and reliable.
        </p>

        <h2 className="text-3xl font-semibold text-gray-800 mt-8">What We Offer</h2>
        <ul className="text-lg text-gray-700 mt-4 space-y-2 list-disc list-inside text-left mx-auto max-w-lg">
          <li>High-Quality Car Accessories</li>
          <li>AI-Powered Damage Detection</li>
          <li>Real-Time Towing Assistance</li>
        </ul>

        <h2 className="text-3xl font-semibold text-gray-800 mt-8">Why Choose Us?</h2>
        <ul className="text-lg text-gray-700 mt-4 space-y-2 list-disc list-inside text-left mx-auto max-w-lg">
          <li>Advanced AI-Driven Technology</li>
          <li>User-Friendly Experience</li>
          <li>Fast & Reliable Service Network</li>
          <li>Secure & Seamless Payment Transactions</li>
        </ul>

        <h2 className="text-3xl font-semibold text-gray-800 mt-8">Our Vision</h2>
        <p className="text-lg text-gray-700 mt-2">
          We envision a world where car maintenance is hassle-free and technologically advanced. By continuously innovating, we aim to provide smarter, faster, and more reliable automotive solutions.
        </p>

        <h2 className="text-3xl font-semibold text-gray-800 mt-8">Meet the Developer</h2>
        <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-indigo-700">Kasireddy Adarsh Reddy</h3>
          <p className="text-lg text-gray-700 mt-2">MERN Stack Developer | Passionate about building cutting-edge web applications with a seamless user experience.</p>
          <p className="text-gray-600 mt-2">Dedicated to innovation and problem-solving in the tech industry.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="https://github.com/adarsh0719" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">GitHub</a>
            <a href="https://linkedin.com/in/adarsh-kasireddy-0719ka" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
            <a href="https://adarsh0719.github.io/adarsh-portfolio" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Portfolio</a>
          </div>
        </div>

        <h2 className="text-3xl font-semibold text-gray-800 mt-8">Get in Touch</h2>
        <p className="text-lg text-gray-700 mt-2">
          Have questions or need assistance? Contact us anytime—we’re here to help!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
