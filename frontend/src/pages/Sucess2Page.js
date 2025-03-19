import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import SuccessImage from '../assest/d2ae7d17-a138-4680-aea0-349471c00d22.mp4';

const Sucess2Page = () => {
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
    <div className="max-w-full mx-auto p-4 sm:p-6 m-3 rounded-xl flex flex-col justify-center items-center overflow-hidden w-full min-h-screen">
      {isLoading && (
        <div className="flex justify-center items-center min-h-screen">
          <div className="loader border-t-4 border-green-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}

      {!isLoading && showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <div
        className={`relative transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'} w-full`}
        style={{ display: isLoading ? 'none' : 'block' }}
      >
        {/* Video Container */}
        <div className="mx-4 sm:mx-0">
          <video
            className="relative max-w-full h-auto sm:w-[600px] sm:h-[auto] w-full px-2 sm:px-0"
            autoPlay
            loop
            muted
            onLoadedData={handleVideoLoaded}
          >
            <source src={SuccessImage} type="video/mp4" />
          </video>
        </div>

        {/* Payment Successful Text */}
        <div className="absolute top-[15px] sm:top-[20px] w-full text-center text-green-600 text-xl sm:text-4xl font-bold animate-bounce px-2">
          Payment Successful!
        </div>

        {/* See Order Button */}
        <Link
          to="/towingservice"
          className="absolute bottom-[15px] sm:bottom-[20px] left-1/2 transform -translate-x-1/2 px-4 sm:px-6 py-2 border-2 border-green-500 rounded-md text-green-500 font-semibold hover:bg-green-600 hover:text-white transition-transform duration-500 animate-slide-up text-sm sm:text-base"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Sucess2Page;