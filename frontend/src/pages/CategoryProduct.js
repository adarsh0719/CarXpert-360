import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import productCategory from '../helpers/productCategory'
import VerticalCard from '../components/VerticalCard'
import SummaryApi from '../common'

const CategoryProduct = () => {
    const [data,setData] = useState([])
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const location = useLocation()
    const urlSearch = new URLSearchParams(location.search)
    const urlCategoryListinArray = urlSearch.getAll("category")

    const urlCategoryListObject = {}
    urlCategoryListinArray.forEach(el =>{
      urlCategoryListObject[el] = true
    })

    const [selectCategory,setSelectCategory] = useState(urlCategoryListObject)
    const [filterCategoryList,setFilterCategoryList] = useState([])
    const [sortBy,setSortBy] = useState("")

    const fetchData = async()=>{
      const response = await fetch(SummaryApi.filterProduct.url,{
        method : SummaryApi.filterProduct.method,
        headers : {
          "content-type" : "application/json"
        },
        body : JSON.stringify({
          category : filterCategoryList
        })
      })

      const dataResponse = await response.json()
      setData(dataResponse?.data || [])
    }

    const handleSelectCategory = (e) =>{
      const {value, checked} =  e.target
      setSelectCategory(prev => ({...prev, [value]: checked}))
    }

    useEffect(()=>{ fetchData() },[filterCategoryList])

    useEffect(()=>{
      const arrayOfCategory = Object.keys(selectCategory)
        .filter(categoryKeyName => selectCategory[categoryKeyName])
      
      setFilterCategoryList(arrayOfCategory)
      const urlFormat = arrayOfCategory.map(el => `category=${el}`).join("&")
      navigate(`/product-category?${urlFormat}`)
    },[selectCategory])

    const handleOnChangeSortBy = (e)=>{
      const { value } = e.target
      setSortBy(value)
      const sortedData = [...data]
      if(value === 'asc') sortedData.sort((a,b)=>a.sellingPrice - b.sellingPrice)
      if(value === 'dsc') sortedData.sort((a,b)=>b.sellingPrice - a.sellingPrice)
      setData(sortedData)
    }

    return (
        <div className='container bg-white mx-auto p-4'>
            {/* Mobile View */}
            <div className='lg:hidden'>
                <div className='mb-4 space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Sort By</label>
                        <select
                            value={sortBy}
                            onChange={handleOnChangeSortBy}
                            className='w-full p-2 border rounded-md'
                        >
                            <option value="">Default</option>
                            <option value="asc">Price: Low to High</option>
                            <option value="dsc">Price: High to Low</option>
                        </select>
                    </div>

                    <div className='bg-gray-50 p-3 rounded-lg'>
                        <h3 className='text-base font-semibold text-gray-700 mb-3'>Filter by Category</h3>
                        <div className='space-y-2'>
                            {productCategory.map((category) => (
                                <div key={category.value} className='flex items-center'>
                                    <input
                                        type="checkbox"
                                        id={`mobile-${category.value}`}
                                        value={category.value}
                                        checked={selectCategory[category.value] || false}
                                        onChange={handleSelectCategory}
                                        className='h-4 w-4 text-indigo-600'
                                    />
                                    <label 
                                        htmlFor={`mobile-${category.value}`}
                                        className='ml-2 text-sm text-gray-600'
                                    >
                                        {category.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <p className='font-medium text-lg mb-4'>Search Results: {data.length}</p>
                    <VerticalCard data={data} loading={loading} />
                </div>
            </div>

            {/* Desktop View */}
            <div className='hidden lg:grid grid-cols-[200px,1fr] gap-6'>
                <div className='bg-gray-50 p-4 rounded-lg'>
                    <div className='mb-6'>
                        <h3 className='text-base font-semibold mb-3'>Sort by</h3>
                        <div className='space-y-2'>
                            <div className='flex items-center'>
                                <input
                                    type="radio"
                                    name="sortBy"
                                    value="asc"
                                    checked={sortBy === 'asc'}
                                    onChange={handleOnChangeSortBy}
                                    className='h-4 w-4 text-indigo-600'
                                />
                                <label className='ml-2 text-sm'>Price - Low to High</label>
                            </div>
                            <div className='flex items-center'>
                                <input
                                    type="radio"
                                    name="sortBy"
                                    value="dsc"
                                    checked={sortBy === 'dsc'}
                                    onChange={handleOnChangeSortBy}
                                    className='h-4 w-4 text-indigo-600'
                                />
                                <label className='ml-2 text-sm'>Price - High to Low</label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className='text-base font-semibold mb-3'>Category</h3>
                        <div className='space-y-2'>
                            {productCategory.map((category) => (
                                <div key={category.value} className='flex items-center'>
                                    <input
                                        type="checkbox"
                                        id={category.value}
                                        value={category.value}
                                        checked={selectCategory[category.value] || false}
                                        onChange={handleSelectCategory}
                                        className='h-4 w-4 text-indigo-600'
                                    />
                                    <label 
                                        htmlFor={category.value}
                                        className='ml-2 text-sm'
                                    >
                                        {category.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='p-4'>
                    <p className='font-medium text-lg mb-4'>Search Results: {data.length}</p>
                    <div className='grid grid-cols-1 gap-4'>
                        <VerticalCard data={data} loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryProduct