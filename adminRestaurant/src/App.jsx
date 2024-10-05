import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Import your components
import PrivateRoute from './components/auth/PrivateRoute';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import {NextUIProvider} from "@nextui-org/react";

// Import new components (you'll need to create these)
import Home from './components/screens/Home';
import Sections from './components/screens/Sections';
import Additions from './components/screens/Additions';
import Orders from './components/screens/Orders';
import Dishes from './components/screens/Dishes';
import Settings from './components/screens/Settings';

function App() {
  return (
    <NextUIProvider>

    
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/sections" element={<PrivateRoute><Sections /></PrivateRoute>} />
          <Route path="/additions" element={<PrivateRoute><Additions /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="/dishes" element={<PrivateRoute><Dishes /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="*" element={<PrivateRoute><div>Page not found</div></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </NextUIProvider>
  );
}

export default App;