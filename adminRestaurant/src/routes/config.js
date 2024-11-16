import { lazy } from 'react';

// Import non-lazy loaded components
import Login from '@/components/auth/login';

// Lazy load components
const SignUp = lazy(() => import('@/components/auth/SignUp'));
const EmployeeSignUp = lazy(() => import('@/components/auth/EmployeeSignUp'));
const Home = lazy(() => import('@/components/screens/Home'));
const Sections = lazy(() => import('@/components/screens/Sections'));
const Additions = lazy(() => import('@/components/screens/Additions'));
const Orders = lazy(() => import('@/components/screens/Orders'));
const Dishes = lazy(() => import('@/components/screens/Dishes/DishTable'));
const Rewards = lazy(() => import('@/components/screens/Rewards'));
const Features = lazy(() => import('@/components/screens/Features'));
const Settings = lazy(() => import('@/components/screens/Settings'));
const SectionDetails = lazy(() => import('@/components/screens/Sections/SectionDetails'));
const DishDetails = lazy(() => import('@/components/screens/Dishes/DishDetails'));
const AdditionDetails = lazy(() => import('@/components/screens/Additions/AdditionsDetails'));
const ModifierDetails = lazy(() => import('@/components/screens/Additions/ModifierDetails'));

export const routes = {
  auth: {
    signin: {
      path: '/signin',
      component: Login,
      public: true
    },
    signup: {
      path: '/signup',
      component: SignUp,
      public: true
    },
    employeeSignup: {
      path: '/employee/signup',
      component: EmployeeSignUp,
      public: true
    }
  },
  dashboard: {
    path: '/',
    component: Home
  },
  sections: {
    list: {
      path: '/sections',
      component: Sections
    },
    details: {
      path: '/sections/merchant/:merchantId/category/:categoryId',
      component: SectionDetails
    }
  },
  dishes: {
    list: {
      path: '/dishes',
      component: Dishes
    },
    details: {
      path: '/dishes/merchant/:merchantId/dishes/:itemId',
      component: DishDetails
    }
  },
  additions: {
    list: {
      path: '/additions',
      component: Additions
    },
    details: {
      path: '/additions/merchant/:merchantId/additions/:modifierGroupId',
      component: AdditionDetails
    },
    modifier: {
      path: '/additions/merchant/:merchantId/modifier/:modifierId',
      component: ModifierDetails
    }
  },
  orders: {
    path: '/orders',
    component: Orders
  },
  rewards: {
    path: '/rewards',
    component: Rewards
  },
  features: {
    path: '/features',
    component: Features
  },
  settings: {
    path: '/settings',
    component: Settings
  }
};

// Helper function to get all routes as a flat array
export const getFlattenedRoutes = () => {
  const flattenRoutes = (routesObj, parentKey = '') => {
    return Object.entries(routesObj).reduce((acc, [key, value]) => {
      if (value.path) {
        // If it's a route configuration object
        acc.push({
          ...value,
          key: `${parentKey}${key}`
        });
      } else if (typeof value === 'object') {
        // If it's a nested routes object
        acc.push(...flattenRoutes(value, `${parentKey}${key}.`));
      }
      return acc;
    }, []);
  };

  return flattenRoutes(routes);
};
