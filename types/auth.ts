export interface User {
  id: number;
  email: string;
  isOnboarded: boolean;
}

export interface AuthResponse {
  access_token: string;
  isOnboarded: boolean;
  user: User;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthError {
  message: string;
  statusCode: number;
}
