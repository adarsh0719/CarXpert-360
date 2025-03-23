import React, { useContext, useEffect, useRef, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const VerticalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);
  const scrollElement = useRef();
  const { fetchUserAddToCart } = useContext(Context);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

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

  useEffect(() => {
    fetchData();
  }, []);

  // Mobile touch handlers with momentum scrolling
  const handleTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX;
    scrollLeft.current = scrollElement.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.touches[0].pageX;
    const walk = (x - startX.current) * 2; // Adjust multiplier for sensitivity
    scrollElement.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    // Add smooth momentum scroll
    const container = scrollElement.current;
    const start = container.scrollLeft;
    const momentum = (container.scrollLeft - start) * 0.2;
    
    const animate = () => {
      if (!isDragging.current && Math.abs(momentum) > 0.5) {
        container.scrollLeft += momentum;
        momentum *= 0.95; // Decay factor
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  // Desktop smooth scroll (unchanged)
  const smoothScroll = (direction) => {
    if (scrollElement.current) {
      const container = scrollElement.current;
      const card = container.firstChild;
      if (!card) return;

      const cardWidth = card.getBoundingClientRect().width;
      const gap = parseInt(getComputedStyle(container).gap.replace('px', '')) || 0;
      const scrollAmount = 1 * (cardWidth + gap);
      const targetScroll = direction === 'right' ? container.scrollLeft + scrollAmount : container.scrollLeft - scrollAmount;
      
      let startTime;
      const duration = 1000;
      const startScroll = container.scrollLeft;

      const animateScroll = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        container.scrollLeft = startScroll + (targetScroll - startScroll) * easeOutCubic;
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      requestAnimationFrame(animateScroll);
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 my-4 sm:my-6 relative">
      <h2 className="text-xl sm:text-2xl font-semibold py-3 sm:py-4 text-gray-800">{heading}</h2>

      <div className="relative">
        {/* Desktop scroll buttons (unchanged) */}
        <button
          className="bg-white shadow-lg rounded-full p-3 absolute left-0 top-1/2 transform -translate-y-1/2 text-lg hidden md:block hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 z-10"
          onClick={() => smoothScroll('left')}
        >
          <FaAngleLeft className="text-gray-700" />
        </button>

        <button
          className="bg-white shadow-lg rounded-full p-3 absolute right-0 top-1/2 transform -translate-y-1/2 text-lg hidden md:block hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 z-10"
          onClick={() => smoothScroll('right')}
        >
          <FaAngleRight className="text-gray-700" />
        </button>

        {/* Enhanced scroll container */}
        <div 
          className="flex items-center gap-3 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-none 
            transition-[scroll-behavior] duration-300 touch-pan-y md:touch-auto
            scroll-snap-x mandatory md:scroll-snap-none"
          ref={scrollElement}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          style={{ 
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch' 
          }}
        >
          {loading
            ? loadingList.map((_, index) => (
                <div 
                  key={index} 
                  className="w-full min-w-[280px] sm:min-w-[280px] md:min-w-[320px] max-w-[280px] sm:max-w-[280px] md:max-w-[320px] 
                    bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 scroll-snap-align-start"
                >
                  <div className="bg-gray-200 h-40 sm:h-48 p-4 animate-pulse rounded-t-xl" />
                  <div className="p-3 sm:p-4 grid gap-2 sm:gap-3">
                    <div className="h-4 sm:h-5 w-3/4 bg-gray-200 animate-pulse rounded" />
                    <div className="h-3 sm:h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
                    <div className="h-3 sm:h-4 w-1/3 bg-gray-200 animate-pulse rounded" />
                    <button className="h-7 sm:h-8 bg-gray-300 w-full animate-pulse rounded" />
                  </div>
                </div>
              ))
            : data.map((product) => (
                <Link 
                  key={product._id} 
                  to={`product/${product._id}`}
                  className="w-full min-w-[280px] sm:min-w-[280px] md:min-w-[320px] max-w-[280px] sm:max-w-[280px] md:max-w-[320px] 
                    bg-white rounded-xl shadow-md md:hover:shadow-xl transition-shadow border border-gray-100 relative overflow-hidden group
                    scroll-snap-align-start"
                >
                  <div className="bg-gray-200 h-40 sm:h-48 flex justify-center items-center overflow-hidden p-0 rounded-t-xl relative">
                    <img 
                      src={product.productImage[0]} 
                      className="object-cover w-full h-full md:group-hover:scale-110 transition-all duration-300" 
                      alt={product.productName} 
                    />
                  </div>
                  <div className="p-3 sm:p-4 grid gap-2 sm:gap-3">
                    <h2 className="font-medium text-sm sm:text-base md:text-lg text-ellipsis line-clamp-1 text-gray-800">
                      {product.productName}
                    </h2>
                    <p className="capitalize text-slate-500 text-xs sm:text-sm">
                      {product.category}
                    </p>
                    <div className="flex gap-2 sm:gap-3 items-center">
                      <p className="text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full text-xs sm:text-sm">
                        {displayINRCurrency(product.sellingPrice)}
                      </p>
                      <p className="text-slate-500 line-through text-xs sm:text-sm">
                        {displayINRCurrency(product.price)}
                      </p>
                    </div>
                    <button 
                      className="text-xs sm:text-sm bg-black hover:bg-gray-800 text-white px-3 py-1 sm:px-4 sm:py-2 font-semibold rounded-full transition-all duration-300 transform md:hover:scale-105"
                      onClick={(e) => handleAddToCart(e, product._id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

export default VerticalCardProduct;