import React, { useState, useRef, useEffect } from 'react';
import { IoNotificationsOutline, IoSettingsOutline, IoPersonOutline, IoLogOutOutline } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

export default function SiteHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getHeaderTitle = () => {
    // ... logic to determine header title based on location.pathname
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/sections':
        return 'Sections';
      case '/dishes':
        return 'Dishes';
      case '/additions':
        return 'Additions';
      case '/orders':
        return 'Orders';
      case '/notifications':
        return 'Notifications';
      // ... add more cases as needed
      case '/settings':
        return 'Settings';
      default:
        // Check for the section details path
        if (location.pathname.match(/^\/sections\/merchant\/[\w]+\/sections\/[\w]+$/)) {
          return 'Section Details';
        }
        // Check for the dish details path
        if (location.pathname.match(/^\/dishes\/merchant\/[\w]+\/dishes\/[\w]+$/)) {
          return 'Dish Details';
        }
        // Check for the addition details path
        if (location.pathname.match(/^\/additions\/merchant\/[\w]+\/additions\/[\w]+$/)) {
          return 'Addition Details';
        }
        return 'Odama Studio';
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      // Redirect to login page or home page after successful logout
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      // Optionally, you can show an error message to the user
    }
  };

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

  return (
    <header className="w-full border-b bg-white">
      <div className="flex h-14 items-center px-4 justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold">{getHeaderTitle()}</h1>
        </div>
        <div className="flex items-center space-x-6">
          <button className="text-gray-600 hover:text-gray-900">
            <IoSettingsOutline size={24} />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <IoNotificationsOutline size={24} />
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              className="text-gray-600 hover:text-gray-900"
              onClick={toggleDropdown}
            >
              <IoPersonOutline size={24} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <IoPersonOutline className="mr-2" size={18} />
                  Profile
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <IoSettingsOutline className="mr-2" size={18} />
                  Settings
                </a>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <IoLogOutOutline className="mr-2" size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}