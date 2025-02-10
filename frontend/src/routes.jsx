import { Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import GuestLayout from './layouts/GuestLayout';

// Páginas de autenticación
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Páginas del dashboard
import Dashboard from './pages/dashboard';
import Restaurants from './pages/restaurants';
import Tables from './pages/tables';
import Customers from './pages/customers';
import Reservations from './pages/reservations';
import Employees from './pages/employees';
import Profile from './pages/profile';
import Settings from './pages/settings';

// Rutas protegidas que requieren autenticación
const protectedRoutes = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'restaurants', element: <Restaurants /> },
      { path: 'tables', element: <Tables /> },
      { path: 'customers', element: <Customers /> },
      { path: 'reservations', element: <Reservations /> },
      { path: 'employees', element: <Employees /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> }
    ]
  }
];

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> }
    ]
  }
];

const routes = [...publicRoutes, ...protectedRoutes];

export default routes;
