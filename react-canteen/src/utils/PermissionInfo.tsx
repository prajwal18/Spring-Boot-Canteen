import CategoriesItems from '../pages/categories-items/CategoriesItems';
import ManageUsers from '../pages/manage-users/ManageUsers';
import MyOrders from '../pages/my-orders/MyOrders';
import OrderHistory from '../pages/order-history/OrderHistory';
import { AuthUser } from '../redux/slice/sessionSlice';

export enum Roles {
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
}
export const rolesOption = [
  { id: Roles.ADMIN, name: Roles.ADMIN },
  { id: Roles.STAFF, name: Roles.STAFF },
  { id: Roles.CUSTOMER, name: Roles.CUSTOMER },
];

export const routes = {
  LOGIN: '/login',
  REGISTER: '/register',
  MY_ORDERS: '/',
  CATEGORIES_AND_ITEMS: '/categories-and-items',
  ORDER_HISTORY: '/order-history',
  MANAGE_USERS: '/manage-users',
  SETTINGS: '/settings'
};

export type RoleAndRoutesType = {
  [key: string]: Array<string>;
};

export const roleAndRoutes: RoleAndRoutesType = {
  CUSTOMER: [routes.MY_ORDERS, routes.SETTINGS],
  STAFF: [routes.CATEGORIES_AND_ITEMS, routes.ORDER_HISTORY, routes.SETTINGS],
  ADMIN: [routes.MANAGE_USERS, routes.SETTINGS],
};

export const getRoutesOfAuthUser = (roles: Array<string>) => {
  let userRoutes: Array<string> = [];
  roles.forEach((role) => {
    const pages = roleAndRoutes[role];
    for(let page of pages){
      if(!userRoutes.includes(page)){
        userRoutes.push(page);
      }
    }
  });
  return userRoutes;
};


export const userHasAnyPermissions = (roles:Array<string>, permissions:Array<string>) => {
    for(let permission of permissions){
      if(roles.includes(permission)){
        return true
      }
    }
    return false
}


export const isUserAdmin = (user: AuthUser) => {
  for (let i = 0; i < user.roles.length; i++) {
    let role = user.roles[i];
    if (role === Roles.ADMIN) {
      return true;
    }
  }
  return false;
};