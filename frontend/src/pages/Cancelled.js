import React from 'react';
import CancelImage from '../assest/c1ea56f4-cfbc-4b39-a01c-684a8e0d56ee.mp4';
import { Link } from 'react-router-dom';

const CancelPage = () => {
  return (
    <div className="max-w-full sm:max-w-md mx-auto p-4 sm:p-6 m-3 sm:m-4 rounded-xl flex flex-col justify-center items-center overflow-hidden w-full min-h-screen">
      <div className="relative w-full">
        <video 
          className="relative w-full sm:w-[600px] mx-auto" 
          autoPlay 
          loop 
          muted
          style={{ pointerEvents: "none" }}
        >
          <source src={CancelImage} type="video/mp4" />
        </video>

        {/* Payment Failed Text */}
        <div className="absolute bottom-[20px] sm:bottom-[25px] left-1/2 transform -translate-x-1/2 w-full text-center text-red-600 text-xl sm:text-3xl font-semibold px-2">
          Payment Failed
        </div>
      </div>

      {/* Book Again Button */}
      <Link 
        to={"/towingservice"} 
        className='p-2 px-6 sm:px-4 mt-4 sm:mt-2 border-2 border-red-500 rounded-md hover:bg-red-600 hover:text-white font-semibold text-sm sm:text-base transition-colors duration-300 text-center w-full sm:w-auto'
      >
        Book Again
      </Link>
    </div>
  );
};

export default CancelPage;