import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children, redirectTo = "/auth", message = null }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null; //  или <LoadingIndicator />
  }

  if (!user) {
    return (
      <Navigate
        to={{
          pathname: redirectTo,
          state: { from: location, message: message },
        }}
      />
    );
  }

  return children;
}

export default PrivateRoute;