import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '../Sidebar';
import  SiteHeader  from '../Navigation/SiteHeader';

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="flex flex-col h-screen">
      <SiteHeader />
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}