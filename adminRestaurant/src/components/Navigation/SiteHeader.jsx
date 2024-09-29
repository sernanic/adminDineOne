// SiteHeader.tsx
import MainNav from './MainNav';
import MobileNav from './MobileNav';
import { IoSettingsOutline, IoSettingsSharp, IoNotificationsOutline } from 'react-icons/io5';
import { Link, useLocation } from 'react-router-dom';

export default function SiteHeader() {
  const location = useLocation();
  const isSettingsPage = location.pathname === '/settings';

  return (
    <header className="w-full border-b">
      <div className="flex h-14 items-center px-4 justify-between">
        <div className="flex items-center">
          <MainNav />
          <MobileNav />
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-900">
            <IoNotificationsOutline size={24} />
          </button>
          <Link to="/settings" className={`${isSettingsPage ? 'text-black' : 'text-gray-600 hover:text-gray-900'}`}>
            {isSettingsPage ? <IoSettingsSharp size={24} /> : <IoSettingsOutline size={24} />}
          </Link>
        </div>
      </div>
    </header>
  );
}
