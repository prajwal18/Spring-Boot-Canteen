import { Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './components/layout/Layout';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import { useHasSessionExpired } from './query/query.auth';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import ProtectedOnlyRoute from './components/ProtectedOnlyRoute';
import Order from './pages/order/Order';
import ForgotPassword from './pages/forgot-password/ForgotPassword';

function App() {
  useHasSessionExpired(); // Refresh session every 100 seconds if the user's logged in.
  return (
    <Box sx={{ width: '100%' }}>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPassword />
            </PublicOnlyRoute>
          }
        />
        <Route path="/order" element={<Order />} />
        <Route
          path="/*"
          element={
            <ProtectedOnlyRoute>
              <Layout />
            </ProtectedOnlyRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </Box>
  );
}

export default App;
