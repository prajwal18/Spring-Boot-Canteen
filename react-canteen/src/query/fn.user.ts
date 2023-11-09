import axios from 'axios';
import endpoints from '../utils/endpoints';
import { jwtAxios } from '../utils/jwtAxios';
import { StatusCodes } from 'http-status-codes';
import { UserPaginationFilterType } from '../redux/slice/userSlice';
import { toast } from 'react-toastify';

export type AddEditUserType = {
  username: string;
  password: string;
  email: string;
  roles: Array<string>;
};
export const registerUserFn = (request: AddEditUserType) => {
  return axios.post(endpoints.user.register, request);
};

// Generate query string to paginate, sort and filter down your users response.
const generateUsersQuery = (paginationFilter: UserPaginationFilterType) => {
  let queryString = '';
  // Attaching page and size
  queryString += `page=${paginationFilter.page}&size=${paginationFilter.size}`;
  // Attaching sort
  queryString += `&sort=${paginationFilter.sort.by},${paginationFilter.sort.order}`;
  // Attaching timerange
  if (paginationFilter.roleFilter) {
    queryString += `&role=${paginationFilter.roleFilter}`;
  }
  // Attaching SearchTerm
  queryString += `&searchTerm=${paginationFilter.searchTerm}`;
  return queryString;
};

export const getAllUsersFn = (paginationFilter: UserPaginationFilterType) => {
  const query = generateUsersQuery(paginationFilter);
  return jwtAxios().get(endpoints.user.fetchUsersFn(query));
};

export const fetchUsersFn = async (args: any, { getState }: any) => {
  const paginationFilter = getState().user.paginationFilter;
  const { data, status } = await getAllUsersFn(paginationFilter);
  if (status === StatusCodes.OK) {
    return data;
  }
  throw new Error('Sorry failed to retrieve users');
};

// Fetch Selected User
export const fetchSelectedUserFn = async (args: any, { getState }: any) => {
  const { id: userId } = getState().session.user;
  const { data, status } = await jwtAxios().get(
    endpoints.user.fetchUserFn(userId),
  );
  if (status === StatusCodes.OK) {
    return data;
  }
  throw new Error('Sorry failed to retrive user');
};

// Add User
export const addUserFn = async (user: AddEditUserType) => {
  try {
    const { status } = await jwtAxios().post(endpoints.user.addUser, user);
    if (status === StatusCodes.CREATED) {
      toast.success('User added successfully');
      return null;
    }
  } catch (error: any) {
    toast.error('Problem creating user.');
  }
  throw new Error('Error creating user');
};

// Edit User
// The password attribute in the request body will get ignored while updating the user's info.
// There are other ways to update the user's password.
export const editUserFn = async (user: AddEditUserType, { getState }: any) => {
  const { id: userId } = getState().user.selectedUser;
  try {
    const { status } = await jwtAxios().put(
      endpoints.user.editUserFn(userId),
      user,
    );
    if (status === StatusCodes.NO_CONTENT) {
      toast.success('User edited successfully');
      return null;
    }
  } catch (error: any) {
    toast.error('Problem editing user.');
  }
  throw new Error('Error editing user');
};

// Delete User
export const deleteUserFn = async (args: any, { getState }: any) => {
  const { id: userId, ...rest } = getState().user.selectedUser;
  try {
    const { status } = await jwtAxios().delete(
      endpoints.user.deleteUserFn(userId),
    );
    if (status === StatusCodes.NO_CONTENT) {
      toast.success('User deleted successfully.');
      return null;
    }
  } catch (error: any) {
    if (error?.response?.data) {
      toast.error(error.response.data);
    } else {
      toast.error(error.message);
    }
  }
  throw new Error('Error deleting user');
};

// Change password by admin
export const changePasswordByAdminFn = async (
  newPassword: string,
  userId: number,
) => {
  try {
    const { status } = await jwtAxios().put(
      endpoints.user.changePasswordByAdminFn(userId),
      { oldPassword: '', newPassword },
    );
    if (status === StatusCodes.NO_CONTENT) {
      toast.success('Password updated successfully');
      return null;
    }
  } catch (error: any) {
    toast.error("Problem editing user's password.");
  }
};

// Change password by user
export type CPType = {
  oldPassword: string;
  newPassword: string;
};
export const changePasswordByUserFn = async (data: CPType, userId: number) => {
  try {
    const { status } = await jwtAxios().put(
      endpoints.user.changePasswordByUserFn(userId),
      data,
    );
    if (status === StatusCodes.NO_CONTENT) {
      toast.success('Password updated successfully');
      return true;
    }
  } catch (error: any) {
    toast.error("Problem editing user's password.");
  }
  return false;
};

// Fetch UserDD
export const fetchUserDDFn = async (searchTerm: string) => {
  const query = `searchTerm=${searchTerm}`;
  const { data, status } = await jwtAxios().get(
    endpoints.user.fetchUserDDFn(query),
  );
  if (status === StatusCodes.OK) {
    return data;
  }
  throw new Error('Error fetching Users drop down data.');
};
