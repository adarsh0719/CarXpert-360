import React, { useState } from 'react';
import { MdModeEditOutline } from 'react-icons/md';
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';
const AdminProductCard = ({ data, fetchdata }) => {
  const [editProduct, setEditProduct] = useState(false);

  return (
    <div className='bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow w-48'>
      <div className='w-full'>
        {/* Image Container */}
        <div className='w-full h-40 overflow-hidden rounded-lg'>
          <img
            src={data?.productImage[0]}
            className='w-full h-full object-cover'
            alt={data?.productName}
          />
        </div>

        {/* Product Name */}
        <h1 className='text-ellipsis line-clamp-2 text-sm font-medium mt-2'>
          {data?.productName}
        </h1>

        {/* Price and Edit Button */}
        <div className='flex items-center justify-between mt-2'>
          <p className='font-semibold text-sm'>
            {displayINRCurrency(data?.sellingPrice)}
          </p>

          {/* Edit Button */}
          <div
            className='w-fit p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer transition-all duration-300'
            onClick={() => setEditProduct(true)}
          >
            <MdModeEditOutline />
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editProduct && (
        <AdminEditProduct
          productData={data}
          onClose={() => setEditProduct(false)}
          fetchdata={fetchdata}
        />
      )}
    </div>
  );
};

export default AdminProductCard;