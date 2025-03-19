


import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import ForgotPassowrd from '../pages/forgotPassowrd'
import SignUp from '../pages/SignUp'
import AdminPanel from '../pages/AdminPanel'
import AllUsers from '../pages/AllUsers'
import AllProducts from '../pages/AllProducts'
import CategoryProduct from '../pages/CategoryProduct'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import SearchProduct from '../pages/SearchProduct'
import SuccessPage from '../pages/SuccessPage'
import Sucess2Page from '../pages/Sucess2Page'
import CancelPage from '../pages/CancelPage'
import OrderPage from '../pages/OrderPage'
import TowingService from '../pages/TowingService'
import DamageDetector from '../pages/DamageDetector'
import AboutUs from '../pages/AboutUs'
import Cancelled from '../pages/Cancelled'
import AllOrder from '../pages/AllOrder'
const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path : "login",
                element : <Login/>
            },
            {
                path : "forgot-password",
                element : <ForgotPassowrd/>
            },
            {
                path : "sign-up",
                element : <SignUp/>
            },
            {
                path : "product-category",
                element : <CategoryProduct/>
            },
            {
                path : "product/:id",
                element : <ProductDetails/>
            },
            {
                path : 'cart',
                element : <Cart/>
            },
            {
                path:"success",
                element:<SuccessPage/>
            },
            {
                path:"successful",
                element:<Sucess2Page/>
            },
            {
                path : "cancelled",
                element : <Cancelled/>
            },
            
            {
                path:"towingservice",
                element:<TowingService/>
            },
            {
                path:"damagedetector",
                element:<DamageDetector/>
            },
            {
                path:"cancel",
                element:<CancelPage/>
            },
            {
                path : "search",
                element : <SearchProduct/>
            },
            {
                path:"order",
                element:<OrderPage/>
            },
            {
                path : "about",
                element : <AboutUs/>
            },
            {
                path : "admin-panel",
                element : <AdminPanel/>,
                children : [
                    {
                        path : "all-users",
                        element : <AllUsers/>
                    },
                    {
                        path : "all-products",
                        element : <AllProducts/>
                    },
                    {
                        path : "all-orders",
                        element : <AllOrder/>
                    }
                ]
            },
        ]
    }
])


export default router

