import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaList, FaPlus, FaShoppingCart, FaUtensils, FaCog } from 'react-icons/fa';

const menuItems = [
  { name: 'Sections', path: '/sections', icon: FaList },
  { name: 'Additions', path: '/additions', icon: FaPlus },
  { name: 'Orders', path: '/orders', icon: FaShoppingCart },
  { name: 'Dishes', path: '/dishes', icon: FaUtensils },
  { name: 'Settings', path: '/settings', icon: FaCog },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Hamburger menu for mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-20"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-10
        w-60 h-screen bg-white border-r
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
        <nav className="flex flex-col space-y-4 p-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-lg p-2 rounded transition-colors flex items-center ${
                location.pathname === item.path
                  ? 'bg-black text-white'
                  : 'hover:underline'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="mr-2" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}