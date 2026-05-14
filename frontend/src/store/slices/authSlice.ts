import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import authApi from '../apis/authApi';

import type { AuthState } from '../types/authTypes';

const initialState: AuthState = {  
  role: null,
  token: null,
  isVerified: false,
  isAuthenticated: false
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
      ), (state, action) => {
        state.isAuthenticated = true;
        state.role = action.payload.data.role;
        state.token = action.payload.data.token;
        state.isVerified = action.payload.data.isVerified;
      }
    ).addMatcher(isAnyOf(
        authApi.endpoints.logout.matchFulfilled,
        authApi.endpoints.logout.matchRejected
      ), (state) => {
        state.token = null;
        state.role = null;
        state.isAuthenticated = false;
      }
    ).addMatcher(
      authApi.endpoints.verifyEmail.matchFulfilled,
      (state) => {
        state.isVerified = true;
      }
    );
  }
});

export const {} = authSlice.actions;
export default authSlice.reducer;
