export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
  // Add any other user properties from your backend
}
export interface AuthContextType {
  user: User | null;
  setUser: any,
  isAuthenticated: boolean,
  setIsAuthenticated: any,
  token: string,
  setToken: any,
}