import React, { useContext, useEffect, useState, useRef } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);
  const { fetchUserAddToCart } = useContext(Context);
  const scrollContainerRef = useRef(null);
  
  // Touch handling refs
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizontalScroll = useRef(false);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const fetchData = async () => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category);
    setLoading(false);
    setData(categoryProduct?.data);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalScroll.current = false;
  };

  const handleTouchMove = (e) => {
    if (!isHorizontalScroll.current) {
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);
      
      // Determine scroll direction
      if (deltaX > deltaY * 2) {
        // Horizontal scroll detected
        isHorizontalScroll.current = true;
        e.preventDefault();
      }
    }
  };

  useEffect(() => {
    fetchData();
    
    // Add touch event listeners
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, []);

  return (
    <div className="container mx-auto px-4 my-6 relative">
      <h2 className="text-2xl font-semibold py-4">{heading}</h2>

      <div 
        className="horizontal-scroll-wrapper"
        ref={scrollContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className="horizontal-scroll-container">
          {loading ? (
            loadingList.map((_, index) => (
              <div
                key={index}
                className="horizontal-card w-full min-w-[240px] md:min-w-[280px] max-w-[240px] md:max-w-[280px] h-32 md:h-36 bg-white rounded-sm shadow flex"
              >
                <div className="bg-slate-200 h-full p-4 min-w-[100px] md:min-w-[120px] animate-pulse" />
                <div className="p-4 grid w-full gap-2">
                  <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black bg-slate-200 animate-pulse p-1 rounded-full" />
                  <p className="capitalize text-slate-500 p-1 bg-slate-200 animate-pulse rounded-full" />
                  <div className="flex gap-3 w-full">
                    <p className="text-red-600 font-medium p-1 bg-slate-200 w-full animate-pulse rounded-full" />
                    <p className="text-slate-500 line-through p-1 bg-slate-200 w-full animate-pulse rounded-full" />
                  </div>
                  <button className="text-sm text-white px-3 py-0.5 rounded-full w-full bg-slate-200 animate-pulse" />
                </div>
              </div>
            ))
          ) : (
            data.map((product, index) => (
              <Link
                key={index}
                to={`product/${product?._id}`}
                className="horizontal-card w-full min-w-[240px] md:min-w-[280px] pr-1 max-w-[240px] md:max-w-[280px] h-32 md:h-36 bg-white rounded-2xl shadow flex hover:shadow-lg transition-all"
              >
                <div className="bg-slate-200 h-full min-w-[100px] md:min-w-[120px] flex-shrink-0">
                  <img
                    src={product.productImage[0]}
                    className="object-cover h-full w-full hover:scale-110 transition-transform"
                    alt={product.productName}
                  />
                </div>
                <div className="p-3 flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="font-medium text-sm md:text-base text-ellipsis line-clamp-1 text-black">
                      {product?.productName}
                    </h2>
                    <p className="text-xs md:text-sm capitalize text-slate-500 mt-1">
                      {product?.category}
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                      <p className="text-red-600 font-medium text-sm md:text-base">
                        {displayINRCurrency(product?.sellingPrice)}
                      </p>
                      <p className="text-slate-500 text-xs line-through">
                        {displayINRCurrency(product?.price)}
                      </p>
                    </div>
                    <button
                      className="text-xs md:text-sm bg-black mt-2 text-white px-3 py-1 rounded-full w-full hover:bg-gray-800 transition-colors"
                      onClick={(e) => handleAddToCart(e, product?._id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Duplicate for infinite scroll effect */}
        <div className="horizontal-scroll-container">
          {loading ? (
            loadingList.map((_, index) => (
              <div
                key={index}
                className="horizontal-card w-full min-w-[240px] md:min-w-[280px] max-w-[240px] md:max-w-[280px] pr-1 h-32 md:h-36 bg-white rounded-2xl shadow flex"
              >
                <div className="bg-slate-200 h-full p-4 min-w-[100px] md:min-w-[120px] animate-pulse" />
                <div className="p-4 grid w-full gap-2">
                  <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black bg-slate-200 animate-pulse p-1 rounded-full" />
                  <p className="capitalize text-slate-500 p-1 bg-slate-200 animate-pulse rounded-full" />
                  <div className="flex gap-3 w-full">
                    <p className="text-red-600 font-medium p-1 bg-slate-200 w-full animate-pulse rounded-full" />
                    <p className="text-slate-500 line-through p-1 bg-slate-200 w-full animate-pulse rounded-full" />
                  </div>
                  <button className="text-sm text-white px-3 py-0.5 rounded-full w-full bg-slate-200 animate-pulse" />
                </div>
              </div>
            ))
          ) : (
            data.map((product, index) => (
              <Link
                key={index}
                to={`product/${product?._id}`}
                className="horizontal-card w-full min-w-[240px] md:min-w-[280px] max-w-[240px] md:max-w-[280px] h-32 md:h-36 bg-white rounded-sm shadow flex hover:shadow-lg transition-all"
              >
                <div className="bg-slate-200 h-full min-w-[100px] md:min-w-[120px] flex-shrink-0">
                  <img
                    src={product.productImage[0]}
                    className="object-cover h-full w-full hover:scale-110 transition-transform overflow-hidden"
                    alt={product.productName}
                  />
                </div>
                <div className="p-3 flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="font-medium text-sm md:text-base text-ellipsis line-clamp-1 text-black">
                      {product?.productName}
                    </h2>
                    <p className="text-xs md:text-sm capitalize text-slate-500 mt-1">
                      {product?.category}
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                      <p className="text-red-600 font-medium text-sm md:text-base">
                        {displayINRCurrency(product?.sellingPrice)}
                      </p>
                      <p className="text-slate-500 text-xs line-through">
                        {displayINRCurrency(product?.price)}
                      </p>
                    </div>
                    <button
                      className="text-xs md:text-sm bg-black mt-2 text-white px-3 py-1 rounded-full w-full hover:bg-gray-800 transition-colors"
                      onClick={(e) => handleAddToCart(e, product?._id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HorizontalCardProduct;