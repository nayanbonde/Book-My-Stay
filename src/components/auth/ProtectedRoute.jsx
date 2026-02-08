import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';

const ProtectedRoute = ({ children, role }) => {
    const user = AuthService.getCurrentUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role && !user.roles?.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
