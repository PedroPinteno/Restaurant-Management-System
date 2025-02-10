import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard';
import Restaurants from '../pages/restaurants';
import RestaurantDetails from '../pages/restaurants/RestaurantDetails';
import Tables from '../pages/tables';
import Reservations from '../pages/reservations';
import Customers from '../pages/customers';
import CustomerDetails from '../pages/customers/CustomerDetails';
import Employees from '../pages/employees';
import EmployeeDetails from '../pages/employees/EmployeeDetails';
import Analytics from '../pages/analytics';
import Settings from '../pages/settings';
import NotFound from '../pages/NotFound';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />

      {/* Rutas privadas */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/restaurants"
        element={
          <PrivateRoute>
            <Restaurants />
          </PrivateRoute>
        }
      />
      <Route
        path="/restaurants/:id"
        element={
          <PrivateRoute>
            <RestaurantDetails />
          </PrivateRoute>
        }
      />

      <Route
        path="/tables"
        element={
          <PrivateRoute>
            <Tables />
          </PrivateRoute>
        }
      />

      <Route
        path="/reservations"
        element={
          <PrivateRoute>
            <Reservations />
          </PrivateRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <PrivateRoute>
            <Customers />
          </PrivateRoute>
        }
      />
      <Route
        path="/customers/:id"
        element={
          <PrivateRoute>
            <CustomerDetails />
          </PrivateRoute>
        }
      />

      <Route
        path="/employees"
        element={
          <PrivateRoute>
            <Employees />
          </PrivateRoute>
        }
      />
      <Route
        path="/employees/:id"
        element={
          <PrivateRoute>
            <EmployeeDetails />
          </PrivateRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <Analytics />
          </PrivateRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />

      {/* Ruta 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
