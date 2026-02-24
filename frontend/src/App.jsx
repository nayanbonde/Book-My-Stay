import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerDashboard from './pages/OwnerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import HotelDetails from './pages/HotelDetails';
import BookingPage from './pages/BookingPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />

            <Route path="/owner/*" element={
              <ProtectedRoute role="ROLE_HOTEL_OWNER">
                <OwnerDashboard />
              </ProtectedRoute>
            } />

            <Route path="/customer/*" element={
              <ProtectedRoute role="ROLE_CUSTOMER">
                <CustomerDashboard />
              </ProtectedRoute>
            } />

            <Route path="/book/:roomId" element={
              <ProtectedRoute role="ROLE_CUSTOMER">
                <BookingPage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
