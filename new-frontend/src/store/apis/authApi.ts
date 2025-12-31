import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

interface AuthResponse {
  message: string;
  data: {
    token: string;
    role: string;
    user: User;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  fName: string;
  lName: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth`
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (data) => ({
        url: 'signup',
        method: 'POST',
        body: data,
      }),
    }),
    googlelogin: builder.mutation<AuthResponse, { idToken: string }>({
      query: ({ idToken }) => ({
        url: 'google-signin',
        method: 'POST',
        body: { idToken },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useGoogleloginMutation, useLogoutMutation } = authApi;
