import React, { useContext, useState, useEffect } from "react";
import { GrSearch } from "react-icons/gr";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import Context from "../context";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollingDown, setScrollingDown] = useState(false);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/");
    }

    if (data.error) {
      toast.error(data.message);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);

    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setScrollingDown(true);
        setScrolled(true);
      } else {
        setScrollingDown(false);
        setScrolled(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const menuItems = [
    { path: "damagedetector", name: "Damage Analyser" },
    { path: "towingservice", name: "Towing Service" },
    { path: "order", name: "MyOrders" },
    { path: "admin-panel/all-users", name: "Admin-Panel" },
    { path: "about", name: "About Us" },
  ];

  return (
    <>
  <header className={`fixed w-full z-30 bg-black transition-all duration-300 ease-out ${showMobileSearch ? 'h-25' : 'h-14'}`}>
  <div className={`container mx-auto flex items-center justify-between px-4 md:px-6 py-2 transition-all duration-300 ease-out ${scrollingDown ? "opacity-100" : "opacity-100"}`}>
    {/* Logo Section - Modified positioning */}
    <div className={`${scrollingDown 
      ? "opacity-100 transition-all duration-300 ease-out fixed left-1/2 transform -translate-x-1/2 z-10" 
      : "opacity-100"} 
      font-bold text-white relative`}>
      <Link to="/">
        <div className="flex items-center gap-2">
          <span className="block w-8 h-8 bg-teal-500 text-white flex items-center justify-center rounded-full text-lg md:text-xl">
            C
          </span>
          <span className="tracking-wide text-sm md:text-xl">CarXpert 360</span>
        </div>
      </Link>
    </div>

          {/* Desktop Search */}
          <div
            className={`${
              scrollingDown ? "opacity-0" : "opacity-100 transition-all duration-300 ease-out"
            } hidden lg:flex items-center w-full max-w-md relative`}
          >
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-teal-500 shadow-sm text-sm md:text-base"
              onChange={handleSearch}
              value={search}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-teal-500">
              <GrSearch className="text-xl" />
            </button>
          </div>

          {/* Right Section */}
          <div
            className={`${
              scrollingDown ? "opacity-0" : "opacity-100 transition-all duration-300 ease-out"
            } flex items-center gap-4 md:gap-6 transition-all duration-300 ease-out`}
          >
            {/* Mobile Search Toggle */}
            <button
              className="lg:hidden text-white"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <GrSearch className="text-xl" />
            </button>
            <button 
  className="relative p-1 group"
  onClick={() => setIsMenuOpen(!isMenuOpen)}
>
  {/* Animated Hamburger Lines */}
  <div className="w-6 h-4 flex flex-col justify-between">
    {/* Top Line */}
    <div className="h-[2px] animate-line-color-movement origin-left" />
    
    {/* Middle Line */}
    <div className="h-[2px] animate-line-color-expand" />
    
    {/* Bottom Line */}
    <div className="h-[2px] animate-line-color-movement origin-right" />
  </div>

  {/* Colorful Background Pulse */}
  <div className="absolute inset-0 rounded-full animate-bg-color-pulse -z-10" />

  {/* Animation Styles */}
  <style jsx global>{`
    @keyframes line-movement {
      0%, 100% {
        transform: translateX(-25%);
        width: 60%;
      }
      50% {
        transform: translateX(0);
        width: 100%;
      }
    }

    @keyframes line-color-movement {
      0% {
        background-color: #3b82f6;
        transform: translateX(-25%);
        width: 60%;
      }
      33% {
        background-color: #8b5cf6;
      }
      66% {
        background-color: #ec4899;
      }
      100% {
        background-color: #3b82f6;
        transform: translateX(0);
        width: 100%;
      }
    }

    @keyframes line-color-expand {
      0% { 
        width: 80%; 
        background-color: #3b82f6;
      }
      50% { 
        width: 100%; 
        background-color: #8b5cf6;
      }
      100% { 
        width: 80%; 
        background-color: #ec4899;
      }
    }

    @keyframes bg-color-pulse {
      0%, 100% {
        opacity: 0.1;
        transform: scale(1);
        background: conic-gradient(
          from 0deg at 50% 50%,
          #3b82f6,
          #8b5cf6,
          #ec4899,
          #3b82f6
        );
      }
      50% {
        opacity: 0.3;
        transform: scale(1.1);
        background: conic-gradient(
          from 180deg at 50% 50%,
          #ec4899,
          #3b82f6,
          #8b5cf6,
          #ec4899
        );
      }
    }

    .animate-line-color-movement {
      animation: 
        line-movement 5s ease-in-out infinite,
        line-color-movement 3s ease-in-out infinite;
    }

    .animate-line-color-expand {
      animation: 
        line-expand 1.8s ease-in-out infinite,
        line-color-expand 2.5s ease-in-out infinite;
    }

    .animate-bg-color-pulse {
      animation: 
        bg-color-pulse 4s ease-in-out infinite;
      background: conic-gradient(
        from 0deg at 50% 50%,
        #3b82f6,
        #8b5cf6,
        #ec4899,
        #3b82f6
      );
      background-size: 200% 200%;
    }
  `}</style>
</button>
            {/* Cart */}
            {user?._id && (
              <Link
                to="/cart"
                className="text-2xl relative text-white hover:text-teal-700 transition-transform"
              >
                <FaShoppingCart />
                <div className="absolute bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs top-[-5px] right-[-10px]">
                  {context?.cartProductCount}
                </div>
              </Link>
            )}

            {/* User Section */}
            <div className="flex items-center gap-2 md:gap-4">
              {user?._id ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="hidden md:block px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors duration-300 text-sm md:text-base"
                  >
                    Logout
                  </button>
                 
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors duration-300 text-sm md:text-base"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

     {/* Mobile Search */}
{showMobileSearch && (
  <div className={`lg:hidden px-4 pb-2 transition-all duration-300 ease-out ${
    scrollingDown ? "opacity-0 h-0" : "opacity-100 h-auto"
  }`}>
    <div className="relative">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-teal-500 shadow-sm text-sm md:text-base"
        onChange={handleSearch}
        value={search}
      />
      <GrSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  </div>
)}
      </header>

      {/* Mobile Menu - Full Screen */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="menu"
            initial={{ x: "-150%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-150%" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-full lg:w-[40%] w-full z-50 text-white backdrop-blur-lg bg-black/40 flex flex-col justify-center px-24"
          >
            {/* Close Button - Original styling */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 left-8 text-white text-lg tracking-widest"
            >
              ✕ CLOSE
            </button>

            {/* Menu Items - Original styling */}
            <div className="flex flex-col space-y-8">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -120 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -120 }}
                  transition={{ duration: 0.8, delay: 0.12 * index, ease: "easeInOut" }}
                  className="flex items-center justify-end space-x-3"
                >
                  <Link
                    to={`/${item.path}`}
                    className="uppercase tracking-wider text-lg font-light hover:text-gray-300 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;