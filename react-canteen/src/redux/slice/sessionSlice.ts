import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchSessionFn } from '../../query/fn.auth';
import {
  logoutClearCookies,
  setSuccessfulLoginCookies,
  updateSessionCookie,
} from '../../utils/cookieUtil';

export type AuthUser = {
  id: number;
  username: string;
  roles: Array<string>;
};

type initialStateType = {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
};

const initialState: initialStateType = {
  user: null,
  token: null,
  isLoggedIn: false,
};

// Thunk actions

export const fetchSession = createAsyncThunk(
  'session/fetchSession',
  fetchSessionFn,
);

const sessionSlice = createSlice({
  name: 'session',
  initialState: initialState,
  reducers: {
    setSession: (state, action) => {
      setSuccessfulLoginCookies(action.payload);
      state.token = action.payload.jwt;
      delete action.payload.jwt;
      state.user = action.payload;
      state.isLoggedIn = true;
      console.log('STATE:', state.user, state.token, state.isLoggedIn);
      return state;
    },
    clearSession: (state, action) => {
      logoutClearCookies();
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSession.fulfilled, (state, action) => {
      state.isLoggedIn = true;
      updateSessionCookie(action.payload);
      delete action.payload.jwt;
      state.user = action.payload;
      state.isLoggedIn = true;
    });
    builder.addCase(fetchSession.rejected, (state, action) => {
      state.isLoggedIn = false;
      logoutClearCookies();
    });
  },
});

// Selectors
export const selectIsLoggedIn = (state: any) => {
  return state.session.isLoggedIn;
};
export const selectToken = (state: any) => {
  return state.session.token;
};
export const selectAuthUser = (state: any) => {
  return state.session.user;
};
// Selectors

export const { setSession, clearSession } = sessionSlice.actions;

export default sessionSlice.reducer;
