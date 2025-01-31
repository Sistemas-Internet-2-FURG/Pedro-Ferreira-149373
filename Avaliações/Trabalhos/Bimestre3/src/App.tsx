import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import About from './pages/About';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}> = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/properties"
          element={
            <ProtectedRoute>
              <Properties />
            </ProtectedRoute>
          }
        />
        <Route
          path="/property/:id"
          element={
            <ProtectedRoute>
              <PropertyDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-property"
          element={
            <ProtectedRoute requiredRole="admin">
              <AddProperty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-property/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <EditProperty />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;