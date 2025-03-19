import React, { useContext, useEffect, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import scrollTop from '../helpers/scrollTop'

const CategroyWiseProductDisplay = ({ category, heading }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const loadingList = new Array(4).fill(null) // Show 4 skeleton cards
  const { fetchUserAddToCart } = useContext(Context)

  const handleAddToCart = async (e, id) => {
    e.preventDefault()
    await addToCart(e, id)
    fetchUserAddToCart()
  }

  const fetchData = async () => {
    setLoading(true)
    const categoryProduct = await fetchCategoryWiseProduct(category)
    setLoading(false)
    setData(categoryProduct?.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='container mx-auto px-1 my-6'>
      <h2 className='text-2xl font-semibold py-4'>{heading}</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {loading ? (
          loadingList.map((_, index) => (
            <div
              key={index}
              className="w-full bg-white shadow-lg border border-gray-300"
            >
              <div className="bg-slate-200 h-48 flex justify-center items-center animate-pulse"></div>
              <div className="p-4 grid gap-3">
                <h2 className="h-6 bg-slate-200 animate-pulse"></h2>
                <p className="h-5 bg-slate-200 animate-pulse"></p>
                <div className="flex gap-3">
                  <p className="h-5 bg-slate-200 animate-pulse w-full"></p>
                  <p className="h-5 bg-slate-200 animate-pulse w-full"></p>
                </div>
                <button className="h-8 bg-slate-200 animate-pulse w-full"></button>
              </div>
            </div>
          ))
        ) : (
          data.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="border border-gray-300 bg-white shadow-lg hover:shadow-xl transition-all ease-in-out duration-300"
              onClick={scrollTop}
            >
              <div className="relative bg-white h-48 flex justify-center items-center overflow-hidden">
                <img
                  src={product.productImage[0]}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 grid gap-3">
                <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
                  {product.productName}
                </h2>
                <p className="capitalize text-slate-500">{product.category}</p>
                <div className="flex gap-3">
                  <p className="text-red-600 font-medium">
                    {displayINRCurrency(product.sellingPrice)}
                  </p>
                  <p className="text-slate-500 line-through">
                    {displayINRCurrency(product.price)}
                  </p>
                </div>
                <button
                  className="text-sm bg-black hover:bg-gray-800 text-white px-3 py-1 w-full transition-colors"
                  onClick={(e) => handleAddToCart(e, product._id)}
                >
                  Add to Cart
                </button>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default CategroyWiseProductDisplay