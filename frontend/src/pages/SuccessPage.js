import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti'; 
import SuccessImage from '../assest/d2ae7d17-a138-4680-aea0-349471c00d22.mp4';

const SuccessPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleVideoLoaded = () => {
    setIsLoading(false);
    setShowConfetti(true); 
  };

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <div className="max-w-full mx-auto p-4 sm:p-6 m-3 rounded-xl flex flex-col justify-center items-center overflow-hidden w-full">
      {isLoading && (
        <div className="flex justify-center items-center h-48">
          <div className="loader border-t-4 border-green-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}

      {!isLoading && showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <div
        className={`relative transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'} w-full`}
        style={{ display: isLoading ? 'none' : 'block' }}
      >
        {/* Mobile Elements */}
        <div className="sm:hidden flex flex-col items-center w-full">
          <video
            className="w-full max-w-[400px] h-auto"
            autoPlay
            loop
            muted
            onLoadedData={handleVideoLoaded}
          >
            <source src={SuccessImage} type="video/mp4" />
          </video>

          <div className="mt-4 text-center">
            <h2 className="text-green-600 text-xl font-bold mb-4 animate-bounce">
              Payment Successful!
            </h2>
            <Link
              to="/order"
              className="block w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              View Your Order
            </Link>
          </div>
        </div>

        {/* Desktop Elements */}
        <div className="hidden sm:block relative w-full">
          <video
            className="max-w-full h-auto sm:w-[600px] sm:h-[auto] w-[80%] mx-auto"
            autoPlay
            loop
            muted
            onLoadedData={handleVideoLoaded}
          >
            <source src={SuccessImage} type="video/mp4" />
          </video>

          <div className="absolute top-[20px] sm:top-[20px] w-full text-center text-green-600 text-2xl sm:text-4xl font-bold animate-bounce">
            Payment Successful!
          </div>

          <Link
            to="/order"
            className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 px-6 py-2 border-2 border-green-500 rounded-md text-green-500 font-semibold hover:bg-green-600 hover:text-white transition-transform duration-500 animate-slide-up"
          >
            See Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;