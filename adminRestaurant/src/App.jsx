import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import Home from './components/screens/Home';
import PrivateRoute from './components/auth/PrivateRoute';
import Sections from './components/screens/Sections';
import SectionDetails from './components/screens/Sections/SectionDetails';
import Additions from './components/screens/Additions';
import Orders from './components/screens/Orders';
import Dishes from './components/screens/Dishes';
import DishDetails from './components/screens/Dishes/DishDetails'; // Import DishDetails
import Settings from './components/screens/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/sections" element={
            <PrivateRoute>
              <Sections />
            </PrivateRoute>
          } />
          <Route path="/sections/merchant/:merchantId/sections/:categoryId" element={
            <PrivateRoute>
              <SectionDetails />
            </PrivateRoute>
          } />
          <Route path="/additions" element={
            <PrivateRoute>
              <Additions />
            </PrivateRoute>
          } />
          <Route path="/orders" element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          } />
          <Route path="/dishes" element={
            <PrivateRoute>
              <Dishes />
            </PrivateRoute>
          } />
          <Route path="/dishes/merchant/:merchantId/dishes/:itemId" element={
            <PrivateRoute>
              <DishDetails />
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;