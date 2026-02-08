import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BookingService from '../services/booking.service';
import PaymentService from '../services/payment.service';

const BookingPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        checkInDate: '',
        checkOutDate: '',
        numberOfRooms: 1
    });
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState('');
    const [paying, setPaying] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            const res = await BookingService.createBooking({ ...formData, roomId });
            setBooking(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed.');
        }
    };

    const handlePayment = async () => {
        setPaying(true);
        try {
            await PaymentService.processPayment(booking.id, booking.totalPrice);
            alert('Payment Successful and Booking Confirmed!');
            // Navigate to customer dashboard which will trigger a reload of bookings
            navigate('/customer', { replace: true });
        } catch (err) {
            setError('Payment failed. Please try again.');
            setPaying(false);
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-6">
                <div className="card premium-card p-4">
                    {!booking ? (
                        <>
                            <h3>Complete Your Booking</h3>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleBooking}>
                                <div className="mb-3">
                                    <label className="form-label">Check-in Date</label>
                                    <input type="date" name="checkInDate" className="form-control" onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Check-out Date</label>
                                    <input type="date" name="checkOutDate" className="form-control" onChange={handleChange} required />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Number of Rooms</label>
                                    <input type="number" name="numberOfRooms" className="form-control" min="1" value={formData.numberOfRooms} onChange={handleChange} required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Book Now</button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h3>Booking Summary</h3>
                            <ul className="list-group list-group-flush mb-4 bg-transparent">
                                <li className="list-group-item bg-transparent"><strong>Booking ID:</strong> {booking.id}</li>
                                <li className="list-group-item bg-transparent"><strong>Dates:</strong> {booking.checkInDate} to {booking.checkOutDate}</li>
                                <li className="list-group-item bg-transparent"><strong>Number of Rooms:</strong> {booking.numberOfRooms}</li>
                                <li className="list-group-item bg-transparent text-primary"><strong>Total Price:</strong> ${booking.totalPrice}</li>
                            </ul>
                            <button onClick={handlePayment} className="btn btn-success w-100" disabled={paying}>
                                {paying ? 'Processing Payment...' : 'Confirm & Pay'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
