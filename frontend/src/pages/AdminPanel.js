import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';
import { toast } from 'react-toastify';

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()

    useEffect(() => {
       if (user?.role !== ROLE.ADMIN) {
            // Show toast first
            toast.error("🔒 Admins only! Redirecting...", {
                toastId: 'admin-auth-error', // Prevent duplicate toasts
                autoClose: 2500,
                onClose: () => navigate("/")
            });
            
            // Fallback navigation in case toast closes too quickly
            const timer = setTimeout(() => navigate("/"), 3000);
            return () => clearTimeout(timer);
        }
    }, [user, navigate])

    if (user?.role !== ROLE.ADMIN) {
        return null; // Return nothing while redirecting
    }

    return (
        <div className='min-h-[calc(100vh-120px)] flex flex-col md:flex-row'>
            {/* Mobile Navigation */}
            <div className='md:hidden bg-white p-4 border-b'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <div className='text-3xl'>
                            {user?.profilePic ? (
                                <img src={user?.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
                            ) : (
                                <FaRegCircleUser />
                            )}
                        </div>
                        <div>
                            <p className='capitalize font-semibold'>{user?.name}</p>
                            <p className='text-xs text-gray-500'>{user?.role}</p>
                        </div>
                    </div>
                </div>
                
                <nav className='mt-4 grid gap-2'>
                    <Link to="all-users" className='p-2 hover:bg-gray-100 rounded'>All Users</Link>
                    <Link to="all-products" className='p-2 hover:bg-gray-100 rounded'>All Products</Link>
                    <Link to="all-orders" className='p-2 hover:bg-gray-100 rounded'>Orders</Link>
                </nav>
            </div>

            {/* Desktop Sidebar */}
            <aside className='bg-white text-black min-h-full w-full max-w-60 customShadow hidden md:block'>
                <div className='h-32 flex justify-center items-center flex-col'>
                    <div className='text-5xl cursor-pointer relative flex justify-center'>
                        {user?.profilePic ? (
                            <img src={user?.profilePic} className='w-20 h-20 rounded-full' alt={user?.name} />
                        ) : (
                            <FaRegCircleUser/>
                        )}
                    </div>
                    <p className='capitalize text-lg font-semibold'>{user?.name}</p>
                    <p className='text-sm'>{user?.role}</p>
                </div>

                <div>   
                    <nav className='grid p-4'>
                        <Link to="all-users" className='px-2 py-1 hover:bg-slate-100'>All Users</Link>
                        <Link to="all-products" className='px-2 py-1 hover:bg-slate-100'>All Products</Link>
                        <Link to="all-orders" className='px-2 py-1 hover:bg-slate-100'>Orders</Link>
                    </nav>
                </div>  
            </aside>

            <main className='w-full h-full p-2 md:p-4'>
                <Outlet/>
            </main>
        </div>
    )
}

export default AdminPanel