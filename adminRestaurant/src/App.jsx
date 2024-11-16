import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "@/components/ui/toaster"
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <NextUIProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
      <Toaster />
    </NextUIProvider>
  );
}

export default App;
