import React, { useEffect, useState } from 'react';
import image1 from '../assest/banner/image1.jpg';
import image2 from '../assest/banner/image2.jpg';
import image3 from '../assest/banner/image3.jpg';
import image4 from '../assest/banner/image4.jpg';
import image5 from '../assest/banner/image5.jpg';
import image1Mobile from '../assest/banner/image1.jpg';
import image2Mobile from '../assest/banner/image2.jpg';
import image3Mobile from '../assest/banner/image3.jpg';
import image4Mobile from '../assest/banner/image4.jpg';
import image5Mobile from '../assest/banner/image5.jpg';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6';
import CategoryList from './CategoryList';

const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const desktopImages = [image1, image2, image3, image4, image5];
  const mobileImages = [
    image1Mobile,
    image2Mobile,
    image3Mobile,
    image4Mobile,
    image5Mobile,
  ];

  const nextImage = () => {
    setCurrentImage(prev => (prev + 1) % desktopImages.length);
  };

  const prevImage = () => {
    setCurrentImage(prev => (prev - 1 + desktopImages.length) % desktopImages.length);
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[70vh] md:h-screen overflow-hidden relative mt-[-16px]">
      {/** Banner Images */}
      <div className="h-full w-full relative">
        {/** Navigation Buttons */}
        <div className="absolute h-full w-full md:flex items-center hidden">
          <div className="flex justify-between w-full text-2xl px-4">
            <button
              onClick={prevImage}
              className="bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition-all"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={nextImage}
              className="bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition-all"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        {/** Desktop and Tablet Version */}
        <div className="hidden md:flex h-full w-full overflow-hidden">
          {desktopImages.map((imageUrl, index) => (
            <div
              className="w-full h-full min-w-full min-h-full transition-transform duration-500 ease-in-out"
              key={imageUrl}
              style={{ transform: `translateX(-${currentImage * 100}%)` }}
            >
              <img
                src={imageUrl}
                className="w-full h-full object-cover"
                alt={`Banner ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/** Mobile Version */}
        <div className="flex h-[60vh] md:hidden w-full overflow-hidden">
          {mobileImages.map((imageUrl, index) => (
            <div
              className="w-full h-full min-w-full min-h-full transition-transform duration-500 ease-in-out"
              key={imageUrl}
              style={{ transform: `translateX(-${currentImage * 100}%)` }}
            >
              <img
                src={imageUrl}
                className="w-full h-full object-cover"
                alt={`Banner ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/** CategoryList - Centered */}
      <div className="absolute z-20 inset-0 flex mt-[10px] justify-center">
        <CategoryList />
      </div>
    </div>
  );
};

export default BannerProduct;