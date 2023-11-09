import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addUserFn,
  deleteUserFn,
  editUserFn,
  fetchSelectedUserFn,
  fetchUserDDFn,
  fetchUsersFn,
} from '../../query/fn.user';

export type UserType = {
  id: number;
  username: string;
  email: string;
  createdOn: string;
  updatedOn: string;
  roles: Array<{ id: number; name: string }>;
};

export type UserDDType = {
  id: number;
  username: string;
  email: string;
};

export type UserPaginationFilterType = {
  page: number;
  size: number;
  sort: {
    by: string;
    order: string;
  };
  total: number;
  searchTerm: string;
  roleFilter: string;
};

type initialStateType = {
  users: Array<UserType> | null;
  userDD: Array<UserDDType> | null;
  selectedUser: UserType | null;
  paginationFilter: UserPaginationFilterType;
  isLoading: boolean;
  error: string | null;
};

const initialState: initialStateType = {
  users: null,
  userDD: null,
  selectedUser: null,
  paginationFilter: {
    page: 0,
    size: 5,
    sort: {
      by: 'createdOn',
      order: 'asc',
    },
    total: 0,
    searchTerm: '',
    roleFilter: 'ALL',
  },
  isLoading: false,
  error: null,
};

// Thunk actions

export const fetchUsers = createAsyncThunk('user/fetchUsers', fetchUsersFn);
export const fetchUserDD = createAsyncThunk('user/fetchUserDD', fetchUserDDFn);
export const fetchSelectedUser = createAsyncThunk(
  'user/fetchSelectedUser',
  fetchSelectedUserFn,
);
export const addUser = createAsyncThunk('user/addUser', addUserFn);
export const editUser = createAsyncThunk('user/editUser', editUserFn);
export const deleteUser = createAsyncThunk('user/deleteUser', deleteUserFn);

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      return state;
    },
    setUsersPage: (state, action) => {
      state.paginationFilter.page = action.payload;
      return state;
    },
    setUsersPageSize: (state, action) => {
      state.paginationFilter.page = 0;
      state.paginationFilter.size = action.payload;
      return state;
    },
    setUsersSort: (state, action) => {
      const new_state = JSON.parse(JSON.stringify(state));
      new_state.paginationFilter.page = 0;
      new_state.paginationFilter.sort = action.payload;
      return new_state;
    },
    resetUsersPaginationFilter: (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(initialState.paginationFilter),
      );
      return state;
    },
    setUsersSearchTerm: (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.paginationFilter.searchTerm = action.payload;
      state.paginationFilter.page = 0;
      return state;
    },
    setUsersRoleFilter: (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.paginationFilter.roleFilter = action.payload;
      state.paginationFilter.page = 0;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
      state.paginationFilter.total = 0;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.users = action.payload.items;
      state.paginationFilter.total = action.payload.total;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.users = null;
      state.error = 'Failed to fetch users';
      state.paginationFilter.total = 0;
    });
    // Fetch a single user successful
    builder.addCase(fetchSelectedUser.fulfilled, (state, action) => {
      state.selectedUser = action.payload;
    });
    // Fetch UserDD successful
    builder.addCase(fetchUserDD.fulfilled, (state, action) => {
      state.userDD = action.payload;
    });
    // Add Successful
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.paginationFilter.page = 0;
    });
    // Edit Successful
    builder.addCase(editUser.fulfilled, (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.selectedUser = null;
    });
    // Delete Successful
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.paginationFilter.page = 0;
      state.selectedUser = null;
    });
  },
});

// Selectors
export const selectUsersIsLoading = (state: any) => {
  return state.user.isLoading;
};
export const selectUsersError = (state: any) => {
  return state.user.error;
};
export const selectUsers = (state: any) => {
  return state.user.users;
};
export const selectUserDD = (state: any) => {
  return state.user.userDD;
};
export const selectSelectedUser = (state: any) => {
  return state.user.selectedUser;
};
export const selectUsersPage = (state: any) => {
  return state.user.paginationFilter.page;
};
export const selectUsersPageSize = (state: any) => {
  return state.user.paginationFilter.size;
};
export const selectUsersSort = (state: any) => {
  return state.user.paginationFilter.sort;
};
export const selectTotalUsers = (state: any) => {
  return state.user.paginationFilter.total;
};
export const selectUsersSearchterm = (state: any) => {
  return state.user.paginationFilter.searchTerm;
};
export const selectUsersRoleFilter = (state: any) => {
  return state.user.paginationFilter.roleFilter;
};
// Selectors

export const {
  setSelectedUser,
  setUsersPage,
  setUsersPageSize,
  setUsersSort,
  resetUsersPaginationFilter,
  setUsersSearchTerm,
  setUsersRoleFilter,
} = userSlice.actions;

export default userSlice.reducer;
