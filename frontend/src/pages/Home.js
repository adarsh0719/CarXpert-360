
import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <div className="w-full mt-[-24px]">
      <BannerProduct />
    </div>
      <HorizontalCardProduct category={"bentley"} heading={"Bentley"}/>
      <VerticalCardProduct category={"ferrari"} heading={"Ferrari"}/>
      <VerticalCardProduct category={"Bugatti"} heading={"Bugatti"}/>
      <VerticalCardProduct category={"Maserati"} heading={"Maserati"}/>
      <VerticalCardProduct category={"Mclaren"} heading={"Mclaren"}/>
      <VerticalCardProduct category={"Rolls Royce"} heading={"Rolls Royce"}/>
      <HorizontalCardProduct category={"Tesla"} heading={"Tesla"}/>
      <VerticalCardProduct category={"Aston Martin"} heading={"Aston Martin"}/>
      <VerticalCardProduct category={"Alfa Romeo"} heading={"Alfa Romeo"}/>
    </div>
  )
}

export default Home

