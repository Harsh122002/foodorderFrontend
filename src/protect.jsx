import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../src/pages/context/UserContext';

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(UserContext);
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useContext(UserContext);   
  return isLoggedIn ? <Navigate to="/dashboard" /> : children;
};
