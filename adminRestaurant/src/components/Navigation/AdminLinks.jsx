import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaChartBar, 
  FaList, 
  FaUtensils, 
  FaPlus, 
  FaShoppingCart, 
  FaCog, 
  FaGift, 
  FaStar, 
  FaUsers,
  FaTools,
  FaBell 
} from 'react-icons/fa';

const NavLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center px-6 py-2 mx-2 text-gray-300 hover:bg-gray-700 ${
        isActive ? 'bg-gray-700 text-white rounded-md' : 'rounded-md'
      }`}
    >
      <Icon className="mr-3" size={20} />
      <span>{children}</span>
    </Link>
  );
};

export default function AdminLinks() {
  return (
    <nav className="mt-5 space-y-2">
      <NavLink to="/" icon={FaChartBar}>Dashboard</NavLink>
      <NavLink to="/orders" icon={FaShoppingCart}>Orders</NavLink>
      <NavLink to="/dishes" icon={FaUtensils}>Dishes</NavLink>
      <NavLink to="/additions" icon={FaPlus}>Additions</NavLink>
      <NavLink to="/sections" icon={FaList}>Sections</NavLink>
      <NavLink to="/features" icon={FaStar}>Features</NavLink>
      <NavLink to="/notifications" icon={FaBell}>Notifications</NavLink>
      <NavLink to="/rewards" icon={FaGift}>Rewards</NavLink>
      <NavLink to="/customers" icon={FaUsers}>Customers</NavLink>
      <NavLink to="/configurations" icon={FaTools}>App Configurations</NavLink>
      <NavLink to="/settings" icon={FaCog}>Settings</NavLink>
    </nav>
  );
}