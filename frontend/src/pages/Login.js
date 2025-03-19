import React, { useContext, useState } from 'react';
import loginIcons from '../assest/signin.gif';
import backgroundImage from '../assest/image.jpg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import imageTobase64 from '../helpers/imageTobase64';
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadPic = async(e) => {
    const file = e.target.files[0];
    const imagePic = await imageTobase64(file);
    setData((preve) => ({
      ...preve,
      profilePic : imagePic
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataResponse = await fetch(SummaryApi.signIn.url, {
      method: SummaryApi.signIn.method,
      credentials: 'include',
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const dataApi = await dataResponse.json();
    if (dataApi.success) {
      toast.success(dataApi.message);
      navigate('/');
      fetchUserDetails();
      fetchUserAddToCart();
    }
    if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  return (
    <section
      id="login"
      className="min-h-screen flex items-center justify-center bg-cover mt-[-24px] bg-center bg-no-repeat relative pt-10"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>

      <div className="relative mx-auto container md:right-96 md:bottom-5 px-4">
        <div className="backdrop-blur-lg bg-white/20 p-4 md:p-6 w-full md:max-w-md mx-auto rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl border border-white/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-50 pointer-events-none animate-pulse"></div>

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

          {/* Login Form */}
          <form className="pt-4 md:pt-8 flex flex-col gap-2 md:gap-3 px-3 md:px-6" onSubmit={handleSubmit}>
            <div className="grid gap-2 md:gap-4">
              <label className="font-semibold text-gray-900 text-sm md:text-base">Email:</label>
              <div className="bg-white/70 p-2 md:p-3 rounded-lg shadow-inner">
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  required
                  className="w-full h-full outline-none bg-transparent text-gray-800 placeholder-gray-500 text-sm md:text-base"
                />
              </div>
            </div>

            <div className="grid gap-1 md:gap-2">
              <label className="font-semibold text-gray-900 text-sm md:text-base">Password:</label>
              <div className="bg-white/70 p-2 md:p-3 flex rounded-lg shadow-inner items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={data.password}
                  name="password"
                  onChange={handleOnChange}
                  required
                  className="w-full h-full outline-none bg-transparent text-gray-800 placeholder-gray-500 text-sm md:text-base"
                />
                <div
                  className="cursor-pointer text-lg md:text-xl ml-2 text-gray-600 hover:text-gray-800"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              <Link to="/forgot-password" className="block w-fit ml-auto text-xs md:text-sm text-blue-700 hover:underline mt-1">
                Forgot password?
              </Link>
            </div>

            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 md:py-3 w-full rounded-full hover:scale-105 transition-transform shadow-lg mt-2 md:mt-4 text-sm md:text-base">
              Login
            </button>
          </form>

          <p className="mt-3 md:mt-4 text-center text-gray-700 text-sm md:text-base">
            Don't have an account? <Link to="/sign-up" className="text-red-600 hover:text-red-700 hover:underline font-semibold">Sign up</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;