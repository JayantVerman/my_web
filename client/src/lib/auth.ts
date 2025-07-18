import { apiRequest } from "./queryClient";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await apiRequest("POST", "/api/auth/login", { username, password });
  const data = await response.json();
  
  // Store token in localStorage
  localStorage.setItem("auth_token", data.token);
  
  return data;
};

export const logout = () => {
  localStorage.removeItem("auth_token");
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const verifyToken = async (): Promise<AuthUser | null> => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const response = await fetch("/api/auth/verify", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!response.ok) {
      logout();
      return null;
    }
    
    const data = await response.json();
    return data.user;
  } catch (error) {
    logout();
    return null;
  }
};
