// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useLogin } from './LoginContext';

// const ProtectedRoute = ({ children, adminOnly = false }) => {
//   const { user, isAdmin } = useLogin();  
//   const location = useLocation();
//   if (!user) {
//         // Redirect to login if no user
//     return <Navigate to="/adminLogin" state={{ from: location.pathname }} replace />;
//   }
//   if (adminOnly && !isAdmin) {
//         // Redirect to home or unauthorized page if not admin
//     return <Navigate to="/" replace />;
//   }
  
//   // User is authenticated and has proper role
//   return children;
// };

// export default ProtectedRoute;















import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLogin } from './LoginContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useLogin();  
  const location = useLocation();
  
  if (!user) {
    // Redirect to login if no user
    return <Navigate to="/adminLogin" state={{ from: location.pathname }} replace />;
  }
  
  if (adminOnly && !isAdmin) {
    // Redirect to home or unauthorized page if not admin
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and has proper role
  return children;
};

export default ProtectedRoute;