import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if(!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;