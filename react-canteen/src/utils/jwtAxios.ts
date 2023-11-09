import axios from 'axios';
import Cookies from 'universal-cookie';

// Returns an axios instance with the jwt auth token attached to its header
export const jwtAxios = () => {
  const cookie = new Cookies();
  const token = cookie.get('authToken');
  return axios.create({
    headers: {
      common: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};
