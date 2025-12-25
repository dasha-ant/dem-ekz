import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: 'calc(100vh - 80px)' 
    }}>
      Загрузка...
    </div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/applications" />;
  }

  return children;
};

export default AdminRoute;