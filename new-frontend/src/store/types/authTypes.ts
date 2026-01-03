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
    isVerified: boolean;
    user: User;
  };
};

interface PassForgotResponse {
    message: string;
};

interface LoginRequest {
  email: string;
  password: string;
};

interface SignupRequest {
  fName: string;
  lName: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

interface PassForgotRequest {
    email: string;
};




export type { User, AuthResponse, LoginRequest, SignupRequest, PassForgotRequest, PassForgotResponse };