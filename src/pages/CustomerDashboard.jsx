import React, { useState, useEffect } from 'react';
import BookingService from '../services/booking.service';

const CustomerDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadBookings = () => {
        setLoading(true);
        BookingService.getCustomerBookings()
            .then(res => {
                setBookings(Array.isArray(res.data) ? res.data : []);
                setLoading(false);
                setError(''); // Clear any previous errors on successful load
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                setError("Failed to load bookings. Please try again.");
                setLoading(false);
            });
    };

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await BookingService.deleteBooking(bookingId);
                // Remove from state immediately for better UX
                setBookings(bookings.filter(b => b.id !== bookingId));
            } catch (error) {
                console.error("Cancel Error:", error);
                setError("Failed to cancel booking. Please try again.");
            }
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Booking History</h2>
                <button className="btn btn-outline-primary btn-sm" onClick={loadBookings} disabled={loading}>
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="premium-card overflow-hidden">
                <div className="table-responsive p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Booking ID</th>
                                <th>Hotel & Room</th>
                                <th className="d-none d-md-table-cell">Stay Duration</th>
                                <th className="d-table-cell d-md-none">Dates</th>
                                <th>Total Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && Array.isArray(bookings) && bookings.length > 0 ? bookings.map(b => (
                                <tr key={b.id}>
                                    <td><span className="fw-bold text-muted small">#{b.id}</span></td>
                                    <td>
                                        <div className="fw-bold text-dark">{b.room?.hotel?.name || 'N/A'}</div>
                                        <div className="small text-muted">{b.room?.type} · {b.numberOfRooms} Room(s)</div>
                                        <div className="small text-secondary fst-italic">{b.room?.hotel?.location}</div>
                                    </td>
                                    <td className="d-none d-md-table-cell">
                                        <div className="small">
                                            <span className="text-muted">In:</span> {b.checkInDate}<br />
                                            <span className="text-muted">Out:</span> {b.checkOutDate}
                                        </div>
                                    </td>
                                    <td className="d-table-cell d-md-none small">
                                        {b.checkInDate} <br /> to <br /> {b.checkOutDate}
                                    </td>
                                    <td className="text-primary fw-bold">${b.totalPrice}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className={`badge rounded-pill px-3 py-2 ${b.status === 'CONFIRMED' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                {b.status}
                                            </span>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleCancelBooking(b.id)}
                                                title="Cancel Booking"
                                            >
                                                <i className="bi bi-x-circle me-1"></i>Cancel
                                            </button>
                                        </div>
                                        {b.status === 'CONFIRMED' && (
                                            <div className="mt-1 small text-success fst-italic">Payment Received</div>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        {loading ? 'Loading your bookings...' : 'No bookings found. Start exploring hotels to book your stay!'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
