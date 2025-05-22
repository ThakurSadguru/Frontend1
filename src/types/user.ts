export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isAdmin?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
} 