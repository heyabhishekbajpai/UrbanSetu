import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, userType }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userType && user.userType !== userType) {
    // Redirect to appropriate dashboard based on user type
    const redirectPath = user.userType === 'admin' ? '/admin' : '/citizen';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
