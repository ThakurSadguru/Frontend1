export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
  isActive?: boolean; // Optional since some existing data might not have this field
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