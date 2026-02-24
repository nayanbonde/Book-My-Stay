import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';

const Navbar = () => {
    const user = AuthService.getCurrentUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container">
                <Link className="navbar-brand" to="/">BOOK MY STAY</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        {user && user.roles?.includes('ROLE_HOTEL_OWNER') && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/owner">Owner Dashboard</Link>
                            </li>
                        )}
                        {user && user.roles?.includes('ROLE_CUSTOMER') && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/customer">My Bookings</Link>
                            </li>
                        )}
                    </ul>
                    <div className="navbar-nav">
                        {user ? (
                            <>
                                <span className="nav-link text-light me-3">Welcome, {user.email}</span>
                                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link className="nav-link" to="/login">Login</Link>
                                <Link className="nav-link" to="/register">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
