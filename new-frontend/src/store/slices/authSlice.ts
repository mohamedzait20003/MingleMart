
import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { authApi } from '../apis/authApi';

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export type Role = string | null;
export type Token = string | null;

export interface AuthState {
  user: User | null;
  role: Role;
  token: Token;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  role: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(
        authApi.endpoints.login.matchFulfilled,
        authApi.endpoints.signup.matchFulfilled,
        authApi.endpoints.googlelogin.matchFulfilled
      ),
      (state, action) => {
        state.user = action.payload.data.user; 
        state.role = action.payload.data.role;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
      }
    )
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state) => {
        state.user = null;  
        state.token = null;
        state.role = null;
        state.isAuthenticated = false;
      }
    );  
  }
});

export const {} = authSlice.actions;
export default authSlice.reducer;
