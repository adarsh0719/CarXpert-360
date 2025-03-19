import React, { useContext } from 'react';
import scrollTop from '../helpers/scrollTop';
import displayINRCurrency from '../helpers/displayCurrency';
import Context from '../context';
import addToCart from '../helpers/addToCart';
import { Link } from 'react-router-dom';

const VerticalCard = ({ loading, data = [] }) => {
  const loadingList = new Array(13).fill(null);
  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,300px))] justify-center md:justify-between gap-4 transition-all">
      {loading
        ? loadingList.map((_, index) => (
            <div
              key={index}
              className="w-full min-w-[240px] md:min-w-[280px] max-w-[240px] md:max-w-[280px] bg-white shadow-lg border border-gray-300"
            >
              <div className="bg-slate-200 h-40 md:h-48 flex justify-center items-center animate-pulse"></div>
              <div className="p-3 md:p-4 grid gap-2 md:gap-3">
                <h2 className="h-5 md:h-6 bg-slate-200 animate-pulse"></h2>
                <p className="h-4 md:h-5 bg-slate-200 animate-pulse"></p>
                <div className="flex gap-3">
                  <p className="h-4 md:h-5 bg-slate-200 animate-pulse w-full"></p>
                  <p className="h-4 md:h-5 bg-slate-200 animate-pulse w-full"></p>
                </div>
                <button className="h-7 md:h-8 bg-slate-200 animate-pulse w-full"></button>
              </div>
            </div>
          ))
        : data.map((product, index) => (
            <Link
              key={index}
              to={`/product/${product?._id}`}
              className="border border-gray-300 w-full min-w-[240px] md:min-w-[280px] max-w-[240px] md:max-w-[280px] bg-white shadow-lg hover:shadow-xl transition-all ease-in-out duration-300"
              onClick={scrollTop}
            >
              <div className="relative bg-white h-40 md:h-48 flex justify-center items-center overflow-hidden shadow-lg">
                <img
                  src={product?.productImage[0]}
                  alt={product?.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 md:p-4 grid gap-2 md:gap-3">
                <h2 className="font-medium text-sm md:text-base lg:text-lg text-ellipsis line-clamp-1 text-black">
                  {product?.productName}
                </h2>
                <p className="capitalize text-slate-500 text-xs md:text-sm">
                  {product?.category}
                </p>
                <div className="flex gap-3">
                  <p className="text-red-600 font-medium text-sm md:text-base">
                    {displayINRCurrency(product?.sellingPrice)}
                  </p>
                  <p className="text-slate-500 line-through text-xs md:text-sm">
                    {displayINRCurrency(product?.price)}
                  </p>
                </div>
                <button
                  className="text-xs md:text-sm bg-black text-white px-2 md:px-3 py-1 w-full hover:bg-gray-800 transition-colors"
                  onClick={(e) => handleAddToCart(e, product?._id)}
                >
                  Add to Cart
                </button>
              </div>
            </Link>
          ))}
    </div>
  );
};

export default VerticalCard;