import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartBar, FaBoxOpen, FaCreditCard, FaUsers, FaBell, FaQuestionCircle, FaCog,FaList,FaUtensils,FaPlus,FaShoppingCart } from 'react-icons/fa';

const NavLink = ({ to, icon: Icon, children }) => (
  <Link to={to} className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700">
    <Icon className="mr-3" />
    <span>{children}</span>
  </Link>
);

const menuItems = [
    { name: 'Home', path: '/'  },
    { name: 'Sections', path: '/sections'  },
    { name: 'Dishes', path: '/dishes'  },
    { name: 'Additions', path: '/additions'  },
    { name: 'Orders', path: '/orders'  },
    
  ];

export default function AdminLinks() {
  return (
    <nav className="mt-5">
      <NavLink to="/" icon={FaChartBar}>Dashboard</NavLink>
      <NavLink to="/sections" icon={FaList}>Sections</NavLink>
      <NavLink to="/dishes" icon={FaUtensils}>Dishes</NavLink>
      <NavLink to="/additions" icon={FaPlus}>Additions</NavLink>
      <NavLink to="/orders" icon={FaShoppingCart}>Orders</NavLink>
      <NavLink to="/settings" icon={FaCog}>Settings</NavLink>
    </nav>
  );
}