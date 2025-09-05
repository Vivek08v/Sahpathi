import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.userSlice);
  console.log("is-Authenticated: ", isAuthenticated);
  if (!isAuthenticated) {
    return (<Navigate to="/login" replace />);
  }
  
  return children;
};

export default ProtectedRoute;