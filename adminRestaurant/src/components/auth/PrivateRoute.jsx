import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SiteHeader from '../Navigation/SiteHeader';
import AdminLinks from '../Navigation/AdminLinks'; // Renamed for clarity

export default function PrivateRoute({ children }) {
  const auth = useAuth();

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
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Mate</h1>
        </div>
        <AdminLinks />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <SiteHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto" style={{ backgroundColor: '#F8F8F8' }}>
          {children}
        </main>
      </div>
    </div>
  );
}