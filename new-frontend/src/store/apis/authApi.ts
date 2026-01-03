import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { AuthResponse, LoginRequest, SignupRequest, PassForgotRequest, PassForgotResponse } from '../types/authTypes';
import type { RootState } from '../index';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
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
        url: 'sign-up',
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
    resendVerification: builder.mutation<void, void>({
      query: () => ({
        url: 'resend-verification',
        method: 'PUT',
      }),
    }),
    verifyEmail: builder.mutation<void, { token: string }>({
      query: ({ token }) => ({
        url: `verify-email`,
        method: 'PUT',
        body: { token },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'logout',
        method: 'POST',
      }),
    }),
    forgotPassword: builder.mutation<PassForgotResponse, PassForgotRequest>({
      query: (data) => ({
        url: 'password-forgot',
        method: 'PUT',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<void, { token: string; password: string; passwordConfirmation: string }>({
      query: ({ token, password, passwordConfirmation }) => ({
        url: 'reset-password',
        method: 'PUT',
        body: { token, password, passwordConfirmation },
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useGoogleloginMutation, useResendVerificationMutation, useVerifyEmailMutation, useLogoutMutation, useForgotPasswordMutation, useResetPasswordMutation } = authApi;