import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NextUIProvider } from "@nextui-org/react";

// Import non-lazy loaded components
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/login';

// Lazy load other components
const SignUp = lazy(() => import('./components/auth/SignUp'));
const EmployeeSignUp = lazy(() => import('./components/auth/EmployeeSignUp'));
const Home = lazy(() => import('./components/screens/Home'));
const Sections = lazy(() => import('./components/screens/Sections'));
const Additions = lazy(() => import('./components/screens/Additions'));
const Orders = lazy(() => import('./components/screens/Orders'));
const Dishes = lazy(() => import('./components/screens/Dishes'));
const Settings = lazy(() => import('./components/screens/Settings'));
const SectionDetails = lazy(() => import('./components/screens/Sections/SectionDetails'));
const DishDetails = lazy(() => import('./components/screens/Dishes/DishDetails'));
const AdditionDetails = lazy(() => import('./components/screens/Additions/AdditionsDetails'));
const ModifierDetails = lazy(() => import('./components/screens/Additions/ModifierDetails'));

// Loading component
const Loading = () => <div>Loading...</div>;

function App() {
  return (
    <NextUIProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/signin" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/employee/signup" element={<EmployeeSignUp />} />
              <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/sections" element={<PrivateRoute><Sections /></PrivateRoute>} />
              <Route 
                path="/sections/merchant/:merchantId/sections/:categoryId" 
                element={<PrivateRoute><SectionDetails /></PrivateRoute>} 
              />
              <Route path="/additions" element={<PrivateRoute><Additions /></PrivateRoute>} />
              <Route 
                path="/additions/merchant/:merchantId/additions/:modifierGroupId" 
                element={<PrivateRoute><AdditionDetails /></PrivateRoute>} 
              />
              <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
              <Route path="/dishes" element={<PrivateRoute><Dishes /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
              <Route path="*" element={<PrivateRoute><div>Page not found</div></PrivateRoute>} />
              <Route 
                path="/dishes/merchant/:merchantId/dishes/:itemId" 
                element={<PrivateRoute><DishDetails /></PrivateRoute>} 
              />
              <Route 
                path="/modifiers/:merchantId/modifier/:modifierId" 
                element={<PrivateRoute><ModifierDetails /></PrivateRoute>} 
              />
            </Routes>
            

          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </NextUIProvider>
  );
}

export default App;
