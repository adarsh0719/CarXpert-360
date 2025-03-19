import React, { useState } from 'react';
import loginIcons from '../assest/signin.gif';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import imageTobase64 from '../helpers/imageTobase64';
import SummaryApi from '../common';
import backgroundImage from '../assest/image.jpg'; 
import { toast } from 'react-toastify';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    profilePic: "",
  });
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    const imagePic = await imageTobase64(file);
    setData((prev) => ({ ...prev, profilePic: imagePic }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password === data.confirmPassword) {
      const dataResponse = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
      });

      const dataApi = await dataResponse.json();
      if (dataApi.success) {
        toast.success(dataApi.message);
        navigate("/login");
      } else {
        toast.error(dataApi.message);
      }
    } else {
      toast.error("Please check password and confirm password");
    }
  };

  return (
    <section
      id="signup"
      className="min-h-screen flex items-center justify-center bg-cover mt-[-24px] bg-center bg-no-repeat relative pt-5"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background overlay with reduced opacity */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>

      <div className="relative mx-auto container md:right-96 md:bottom-5 px-4">
        <div className="backdrop-blur-xl bg-white/20 p-4 md:p-6 w-full md:max-w-md mx-auto rounded-xl md:rounded-2xl shadow-lg md:shadow-lg border border-white/30 relative overflow-hidden">
          {/* Profile Picture */}
          <div className="w-20 h-20 md:w-24 md:h-24 mx-auto relative overflow-hidden rounded-full border-2 border-white">
            <img src={data.profilePic || loginIcons} alt='Profile' className="w-full h-full object-cover" />
            <form>
              <label>
                <div className='text-xs bg-opacity-80 bg-slate-200 pb-1 md:pb-2 pt-1 md:pt-2 cursor-pointer text-center absolute bottom-0 w-full'>
                  Upload Photo
                </div>
                <input type='file' className='hidden' onChange={handleUploadPic} />
              </label>
            </form>
          </div>

          {/* Signup Form */}
          <form className='pt-4 relative flex flex-col gap-2 md:gap-3 px-3 md:px-6' onSubmit={handleSubmit}>
            <div className='grid gap-1 md:gap-2'>
              <label className='font-semibold text-gray-900 text-sm md:text-base'>Name:</label>
              <div className='bg-white/50 p-2 md:p-3 rounded-lg shadow-inner'>
                <input 
                  type='text' 
                  placeholder='Enter your name' 
                  name='name'
                  value={data.name}
                  onChange={handleOnChange}
                  required
                  className='w-full h-full outline-none bg-transparent text-gray-800 placeholder-gray-500 text-sm md:text-base'/>
              </div>
            </div>

            <div className='grid gap-1 md:gap-2'>
              <label className='font-semibold text-gray-900 text-sm md:text-base'>Email:</label>
              <div className='bg-white/50 p-2 md:p-3 rounded-lg shadow-inner'>
                <input 
                  type='email' 
                  placeholder='Enter your email' 
                  name='email'
                  value={data.email}
                  onChange={handleOnChange}
                  required
                  className='w-full h-full outline-none bg-transparent text-gray-800 placeholder-gray-500 text-sm md:text-base'/>
              </div>
            </div>

            <div className='grid gap-1 md:gap-2'>
              <label className='font-semibold text-gray-900 text-sm md:text-base'>Password:</label>
              <div className='bg-white/50 p-2 md:p-3 flex rounded-lg shadow-inner items-center'>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder='Enter your password' 
                  name='password'
                  value={data.password}
                  onChange={handleOnChange}
                  required
                  className='w-full h-full outline-none bg-transparent text-gray-800 placeholder-gray-500 text-sm md:text-base'/>
                <div className='cursor-pointer text-lg md:text-xl ml-2 text-gray-600 hover:text-gray-800' onClick={() => setShowPassword(prev => !prev)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            <div className='grid gap-1 md:gap-2'>
              <label className='font-semibold text-gray-900 text-sm md:text-base'>Confirm Password:</label>
              <div className='bg-white/50 p-2 md:p-3 flex rounded-lg shadow-inner items-center'>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder='Enter confirm password' 
                  name='confirmPassword'
                  value={data.confirmPassword}
                  onChange={handleOnChange}
                  required
                  className='w-full h-full outline-none bg-transparent text-gray-800 placeholder-gray-500 text-sm md:text-base'/>
                <div className='cursor-pointer text-lg md:text-xl ml-2 text-gray-600 hover:text-gray-800' onClick={() => setShowConfirmPassword(prev => !prev)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 md:py-3 w-full rounded-full hover:scale-105 transition-transform shadow-lg mt-3 md:mt-4 text-sm md:text-base'>
              Sign Up
            </button>
          </form>

          <p className='mt-3 md:mt-4 text-center text-gray-700 text-sm md:text-base'>
            Already have an account? <Link to={'/login'} className='text-red-600 hover:text-red-700 hover:underline font-semibold'>Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;