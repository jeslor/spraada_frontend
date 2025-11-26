export interface User {
  id: number;
  email: string;
  isOnboarded: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  isOnboarded: boolean; // True False. 0 1
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
