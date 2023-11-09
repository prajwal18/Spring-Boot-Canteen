import { Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import MyOrders from '../../pages/my-orders/MyOrders';
import ManageUsers from '../../pages/manage-users/ManageUsers';
import CategoriesItems from '../../pages/categories-items/CategoriesItems';
import OrderHistory from '../../pages/order-history/OrderHistory';
import ProtectedRoute from '../ProtectedRoute';
import { Roles, routes } from '../../utils/PermissionInfo';
import NotFound from '../../pages/404';
import SettingsPage from '../../pages/SettingsPage';

const Router = () => {
  return (
    <Box sx={{ padding: '30px 20px 10px 20px' }}>
      <Routes>
        <Route
          path={routes.MY_ORDERS}
          element={
            <ProtectedRoute permissions={[Roles.CUSTOMER]}>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.CATEGORIES_AND_ITEMS}
          element={
            <ProtectedRoute permissions={[Roles.STAFF]}>
              <CategoriesItems />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.ORDER_HISTORY}
          element={
            <ProtectedRoute permissions={[Roles.STAFF]}>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.MANAGE_USERS}
          element={
            <ProtectedRoute permissions={[Roles.ADMIN]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.SETTINGS}
          element={
            <ProtectedRoute permissions={[Roles.ADMIN, Roles.CUSTOMER, Roles.STAFF]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
};

export default Router;
