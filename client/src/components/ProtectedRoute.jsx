import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.userSlice);

  console.log("is-Authenticated: ", isAuthenticated);

  // Case 1: not yet decided (initAuth still running) → show loader
  if (isAuthenticated === null) {
    return <div>Checking authentication...</div>;
  }

  // Case 2: decided and unauthenticated → redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Case 3: authenticated → allow access
  return children;
};

export default ProtectedRoute;





















// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useSelector(state => state.userSlice);
//   console.log("is-Authenticated: ", isAuthenticated);
//   if (!isAuthenticated) {
//     return (<Navigate to="/login" replace />);
//   }
  
//   return children;
// };

// export default ProtectedRoute;