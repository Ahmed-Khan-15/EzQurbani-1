import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useContext(AuthContext);

    // Wait for auth check to complete
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Redirect if user doesn't have required role
    if (role && user.role !== role) {
        // Send them to their respective dashboard
        const dashboardPath = user.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer';
        return <Navigate to={dashboardPath} />;
    }

    return children;
};

export default ProtectedRoute;
