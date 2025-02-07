import  { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ component: Component }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>; // Display loading state if still loading auth data
    }

    return user ? <Component /> : <Navigate to="/login" />; // If the user is logged in, render the component; otherwise, redirect to login
}

export default ProtectedRoute;