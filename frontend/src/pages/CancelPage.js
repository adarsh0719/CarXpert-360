import React from 'react'
import CancelImage from '../assest/c1ea56f4-cfbc-4b39-a01c-684a8e0d56ee.mp4'
import { Link } from 'react-router-dom'

const CancelPage = () => {
  return (
    <div className="max-w-full sm:max-w-md mx-auto p-4 m-4 rounded-md flex flex-col justify-center overflow-hidden w-full">
      {/* Mobile View */}
      <div className="sm:hidden flex flex-col items-center">
        <div className="relative w-full max-w-[400px]">
          <video 
            className="w-full h-auto" 
            autoPlay 
            loop 
            muted
            style={{ pointerEvents: "none" }}
          >
            <source src={CancelImage} type="video/mp4" />
          </video>
          
          <div className="text-center mt-4">
            <div className="text-red-600 text-2xl font-semibold mb-4">
              Payment Failed
            </div>
            <Link 
              to={"/cart"} 
              className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors block text-center"
            >
              Go to Cart
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block relative">
        <video 
          className="relative" 
          autoPlay 
          loop 
          muted 
          width="600" 
          style={{ pointerEvents: "none" }}
        >
          <source src={CancelImage} type="video/mp4" />
        </video>
        
        <div className="absolute translate-x-1/2 bottom-[25px] left-[5px] text-red-600 text-3xl font-semibold">
          Payment Failed
        </div>
      </div>
      
      <Link 
        to={"/cart"} 
        className="hidden sm:block p-2 mt-2 border-2 border-red-500 rounded-md hover:bg-red-600 hover:text-white font-semibold text-center"
      >
        Go to cart
      </Link>
    </div>
  )
}

export default CancelPage