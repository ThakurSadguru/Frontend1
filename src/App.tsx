import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { AnonymousLayout } from './layout/AnonymousLayout';
import { LoginPage } from './pages/loginPage';
import { AuthLayout } from './layout/AuthLayout';
import Dashboard from './pages/Dashboard';
import UserPage from './pages/UserPage';
import { ClientsPage } from './pages/ClientsPage';

function App() {
  return (<>
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<AnonymousLayout />}>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Route>
          <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserPage/>} />
          <Route path="/clients" element={<ClientsPage/>} />
          </Route>
        </Routes>
      </Router>
      </AuthProvider>
    </>
  );
}

export default App;
