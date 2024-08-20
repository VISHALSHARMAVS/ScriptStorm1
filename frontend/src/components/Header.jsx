import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { PiMoonFill } from "react-icons/pi";
import { FaSun } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/feature/userSlice";
import axios from "axios";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/v1/user/signout');
      if (res.status === 200) {
        dispatch(signoutSuccess());
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <nav className="border-b-2 flex justify-between items-center h-16 mx-4 relative">
      <Link
        to="/"
        className={`self-center whitespace-nowrap text-sm sm:text-lg font-semibold dark:text-white ${
          isActive("/") ? "text-blue-500" : ""
        }`}
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          ScriptStorm
        </span>
      </Link>

      <form onSubmit={handleSubmit} className="relative hidden lg:block">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border rounded-lg"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 text-xl"
          aria-label="Search"
        >
          <AiOutlineSearch />
        </button>
      </form>
      <form onSubmit={handleSubmit} className="relative sm:hidden ">
      <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border rounded-lg"
        />
      <button className=' absolute left-3 top-1/2 transform -translate-y-1/2 w-12 h-10  text-gray-500 dark:text-white' >
          <AiOutlineSearch />
        </button>
      </form>

      <button onClick={toggleMenu} className="w-12 h-10 lg:hidden" aria-label="Toggle Menu">
        {isMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
      </button>

      <div className="flex gap-8 md:order-2">
        <button className="hidden sm:inline" onClick={() => dispatch(toggleTheme())} aria-label="Toggle Dark Mode">
          {theme === 'light' ? <PiMoonFill className="text-2xl" /> : <FaSun />}
        </button>

        {currentUser ? (
          <div ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 bg-gray-200 rounded-full"
              aria-label="User Menu"
            >
              <img
                src={currentUser.profilePicture}
                alt="user"
                className="w-10 h-10 rounded-full"
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-4">
                  <span className="block text-sm mb-2 truncate">
                    @{currentUser.username}
                  </span>
                  <span className="block text-sm font-medium truncate">
                    {currentUser.email}
                  </span>
                </div>
                <Link to="/dashboard?tab=profile">
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    Profile
                  </button>
                </Link>
                <div className="border-t border-gray-200"></div>
                <button onClick={handleSignOut} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/sign-in">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold">
              Sign In
            </button>
          </Link>
        )}
      </div>

      <div className="hidden lg:flex lg:items-center lg:gap-12">
        <Link
          to="/"
          className={`text-sm sm:text-lg dark:text-white ${
            isActive("/") ? "text-blue-500" : ""
          }`}
        >
          Home
        </Link>
        <Link
          to="/dashboard?tab=profile"
          className={`text-sm sm:text-lg dark:text-white ${
            isActive("/dashboard?tab=profile") ? "text-blue-500" : ""
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/about"
          className={`text-sm sm:text-lg dark:text-white ${
            isActive("/about") ? "text-blue-500" : ""
          }`}
        >
          About
        </Link>
        <Link
          to="/create-post"
          className={`text-sm sm:text-lg dark:text-white ${
            isActive("/create-post") ? "text-blue-500" : ""
          }`}
        >
          Create Post
        </Link>
      </div>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-800 lg:hidden flex flex-col items-start p-4 shadow-lg ">
          <Link
            to="/"
            className={`text-sm sm:text-lg dark:text-white my-2 ${
              isActive("/") ? "text-blue-500" : ""
            }`}
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
          to="/dashboard?tab=profile"
          className={`text-sm sm:text-lg dark:text-white ${
            isActive("/dashboard?tab=profile") ? "text-blue-500" : ""
          }`}
        >
          Dashboard
        </Link>
          <Link
            to="/about"
            className={`text-sm sm:text-lg dark:text-white my-2 ${
              isActive("/about") ? "text-blue-500" : ""
            }`}
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            to="/create-post"
            className={`text-sm sm:text-lg dark:text-white my-2 ${
              isActive("/create-post") ? "text-blue-500" : ""
            }`}
            onClick={toggleMenu}
          >
            Create Post
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Header;
