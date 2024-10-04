import React from 'react';
import { IoNotificationsOutline, IoSettingsOutline } from 'react-icons/io5';
import { useLocation } from 'react-router-dom';

export default function SiteHeader() {
  const location = useLocation();

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
        return 'Odama Studio';
    }
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="flex h-14 items-center px-4 justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold">{getHeaderTitle()}</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Remove the select element */}
          <button className="text-gray-600 hover:text-gray-900">
            <IoSettingsOutline size={24} />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <IoNotificationsOutline size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}