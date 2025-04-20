import { Navigate } from 'react-router-dom';

const authRequired = (Component) => {
  return (props) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return <Navigate to="/" replace />;  // Redirect to login if not authenticated
    }

    return <Component {...props} />;
  };
};

export default authRequired;
