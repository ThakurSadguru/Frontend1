// src/layouts/AnonymousLayout.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AnonymousLayout() {
  const { isAuthenticated,user } = useAuth();

  if(isAuthenticated && user?.isActive === false){
    return <Navigate to="/support" replace />;
  }
  
  if (isAuthenticated && user?.isActive === true ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
