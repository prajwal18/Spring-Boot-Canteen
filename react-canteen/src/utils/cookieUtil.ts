import Cookies from 'universal-cookie';
import { AuthRes } from '../query/fn.auth';

const cookie = new Cookies();

export const setSuccessfulLoginCookies = (data: AuthRes) => {
  console.log(data);
  cookie.set('authToken', data.jwt);
  cookie.set('userInfo', {
    username: data.username,
    id: data.id,
    roles: data.roles,
  });
  cookie.set('isLoggedIn', true);
};

export const updateSessionCookie = (data: AuthRes) => {
  cookie.set('userInfo', {
    username: data.username,
    id: data.id,
    roles: data.roles,
  });
  cookie.set('isLoggedIn', true);
};

export const retriveUserInfoFromCookie = () => {
  return cookie.get('userInfo');
};

export const retriveAuthTokenFromCookie = () => {
  return cookie.get('authToken');
};

export const retriveLoggedInStatusFromCookie = () => {
  return cookie.get('isLoggedIn');
};

export const logoutClearCookies = () => {
  cookie.remove('authToken');
  cookie.remove('userInfo');
  cookie.set('isLoggedIn', false);
};
