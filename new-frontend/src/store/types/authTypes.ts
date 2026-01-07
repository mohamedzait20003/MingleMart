import type { User } from './userTypes';

// State Types for Authentication
export type Role = string | null;
export type Token = string | null;

export interface AuthState {
  role: Role;
  token: Token;
  isVerified: boolean;
  isAuthenticated: boolean;
}


// Auth API Types
// Basic Authetication Types
export interface AuthResponse {
  message: string;
  data: {
    token: string;
    role: string;
    isVerified: boolean;
    user: User;
  };
};

export interface LoginRequest {
  email: string;
  password: string;
};

export interface SignupRequest {
  fName: string;
  lName: string;
  username: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  password: string;
  passwordConfirmation: string;
};

// Password Forget & Reset Types
export interface PassForgotRequest {
  email: string;
};

export interface PassForgotResponse {
  message: string;
};

export interface ResetPassRequest {
  token: string;
  password: string;
  passwordConfirmation: string;
};

export interface ResetPassResponse {
  message: string;
}