import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/auth.service';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'CUSTOMER'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await AuthService.register(
                formData.email,
                formData.password,
                formData.firstName,
                formData.lastName,
                formData.role
            );
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Try again.');
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-6">
                <div className="card premium-card">
                    <div className="card-body p-5">
                        <h2 className="text-center mb-4">Register</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}
                        <form onSubmit={handleRegister}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">First Name</label>
                                    <input type="text" name="firstName" className="form-control" onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Last Name</label>
                                    <input type="text" name="lastName" className="form-control" onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email Address</label>
                                <input type="email" name="email" className="form-control" onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" name="password" className="form-control" onChange={handleChange} required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label">I am a...</label>
                                <select name="role" className="form-select" onChange={handleChange} value={formData.role}>
                                    <option value="CUSTOMER">Customer</option>
                                    <option value="OWNER">Hotel Owner</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mb-3">Register</button>
                        </form>
                        <p className="text-center mb-0">
                            Already have an account? <Link to="/login">Login here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
