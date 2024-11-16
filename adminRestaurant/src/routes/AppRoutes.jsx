import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { getFlattenedRoutes } from './config';

// Loading component
const Loading = () => <div>Loading...</div>;

export default function AppRoutes() {
  const routes = getFlattenedRoutes();

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {routes.map(({ path, component: Component, public: isPublic, key }) => (
          <Route
            key={key}
            path={path}
            element={
              isPublic ? (
                <Component />
              ) : (
                <PrivateRoute>
                  <Component />
                </PrivateRoute>
              )
            }
          />
        ))}
        <Route
          path="*"
          element={
            <PrivateRoute>
              <div>Page not found</div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
