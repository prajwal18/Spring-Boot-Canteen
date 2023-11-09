import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import endpoints from '../utils/endpoints';
import { jwtAxios } from '../utils/jwtAxios';

export type AuthRes = {
  jwt: string;
  username: string;
  id: number;
  roles: Array<string>;
};

export type AuthReq = {
  username: string;
  password: string;
};

export const loginUserFn = (request: AuthReq) => {
  return axios.post(endpoints.auth.login, request);
};

export const fetchSessionFn = async () => {
  const { data, status } = await jwtAxios()(endpoints.auth.fetchSession);
  if (status === StatusCodes.OK) {
    console.log("FETCH SESSION",data)
    return data;
  } else {
    console.log("FETCH SESSION error")
    throw new Error('Your session has expired');
  }
};
