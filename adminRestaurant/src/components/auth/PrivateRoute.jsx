import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SiteHeader from '../Navigation/SiteHeader';
import AdminLinks from '../Navigation/AdminLinks';
import ProfileDrawer from '../ProfileDrawer';
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between">
        <div>
        <div className="p-4">
          <h1 className="text-2xl font-bold">Mate</h1>
        </div>
        <AdminLinks />
        </div>
        <div className="p-4 flex items-center justify-between">
          <User   
            name={user?.firstName + ' ' + user?.lastName || 'Loading...'}
            description={(
              <Link href="#" size="sm" isExternal style={{ color: 'white' }}>
                {(user?.email && user.email.slice(0, 15) + '...') || 'Loading...'}
              </Link>
            )}
            avatarProps={{
              src: user?.avatarUrl || 'https://via.placeholder.com/150'
            }}
            style={{ color: 'white' }}
          />
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <SiteHeader onProfileClick={() => setIsProfileDrawerOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto" style={{ backgroundColor: '#F8F8F8' }}>
          {children}
        </main>
        <ProfileDrawer isOpen={isProfileDrawerOpen} setIsOpen={setIsProfileDrawerOpen} />
      </div>
    </div>
  );
}
