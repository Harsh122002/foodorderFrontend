import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../src/pages/context/UserContext';

// Utility to determine the redirect path based on the user role
const getRedirectPath = (role) => {
  switch (role) {
    case 'admin':
      return '/adminDashboard';
    case 'delivery':
      return '/boyDashBoard';
    default:
      return '/dashboard';
  }
};

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, userDetail } = useContext(UserContext);

  if (!isLoggedIn) {
    const redirectPath = getRedirectPath(userDetail?.role);
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { isLoggedIn, userDetail } = useContext(UserContext);

  if (isLoggedIn) {
    const redirectPath = getRedirectPath(userDetail?.role);
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
