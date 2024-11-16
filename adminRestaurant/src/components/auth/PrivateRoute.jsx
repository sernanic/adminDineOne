import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SiteHeader from '../Navigation/SiteHeader';
import AdminLinks from '../Navigation/AdminLinks';
import ProfileDrawer from '../shared/ProfileDrawer';
import { User, Link } from "@nextui-org/react";
import useUserStore from '@/stores/userStore';

export default function PrivateRoute({ children }) {
  const auth = useAuth();
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const { user, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (!auth) {
    console.error('AuthContext is undefined. Make sure AuthProvider is wrapping your app.');
    return <Navigate to="/signin" />;
  }

  const { currentUser } = auth;

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - hidden on mobile */}
      <aside className="hidden md:flex w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex-col justify-between shadow-xl">
        <div>
          <div className="p-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Mate
            </h1>
          </div>
          <AdminLinks />
        </div>
        <div className="p-6 border-t border-gray-700">
          <User   
            name={user?.firstName + ' ' + user?.lastName || 'Loading...'}
            description={(
              <Link 
                href="#" 
                size="sm" 
                isExternal 
                className="text-gray-300 hover:text-white transition-colors"
              >
                {(user?.email && user.email.slice(0, 15) + '...') || 'Loading...'}
              </Link>
            )}
            avatarProps={{
              src: user?.avatarUrl || 'https://via.placeholder.com/150',
              className: "ring-2 ring-blue-400"
            }}
            className="transition-transform hover:scale-105"
          />
        </div>
      </aside>

      {/* Main content area - full width on mobile */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <SiteHeader 
          onProfileClick={() => setIsProfileDrawerOpen(true)} 
          className="border-b shadow-sm"
        />
        <main 
          className="flex-1 overflow-x-hidden overflow-y-auto md:p-6" 
          style={{ backgroundColor: '#fafafa' }}
        >
          {children}
        </main>
        <ProfileDrawer isOpen={isProfileDrawerOpen} setIsOpen={setIsProfileDrawerOpen} />
      </div>
    </div>
  );
}
