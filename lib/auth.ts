import { AuthResponse, SignInData, SignUpData, AuthError } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

class AuthAPI {
  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || "An error occurred",
        statusCode: response.status,
      } as AuthError;
    }

    return data;
  }

  async signIn(credentials: SignInData): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async signUp(userData: SignUpData): Promise<AuthResponse> {
    const { confirmPassword, ...signUpData } = userData;
    return this.request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(signUpData),
    });
  }

  async getUser(): Promise<any> {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw { message: "No token found", statusCode: 401 } as AuthError;
    }

    return this.request<any>("/dashboard/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const authAPI = new AuthAPI();
