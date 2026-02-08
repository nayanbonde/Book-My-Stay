import React, { useState, useEffect } from 'react';
import HotelService from '../services/hotel.service';
import BookingService from '../services/booking.service';

const OwnerDashboard = () => {
    const [hotels, setHotels] = useState([]);
    const [newHotel, setNewHotel] = useState({ name: '', location: '', description: '' });
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [newRoom, setNewRoom] = useState({ type: 'SINGLE', pricePerNight: 0, totalRooms: 1, availableRooms: 1 });
    const [newService, setNewService] = useState({ name: '', price: 0 });
    const [hotelBookings, setHotelBookings] = useState([]);

    useEffect(() => {
        loadOwnerData();
    }, []);

    const loadOwnerData = () => {
        HotelService.getOwnerHotels().then(res => setHotels(Array.isArray(res.data) ? res.data : []));
    };

    const handleCreateHotel = async (e) => {
        e.preventDefault();
        await HotelService.createHotel(newHotel);
        setNewHotel({ name: '', location: '', description: '' });
        loadOwnerData();
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        await HotelService.addRoom(selectedHotel.id, newRoom);
        setSelectedHotel(null);
        loadOwnerData();
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        await HotelService.addService(selectedHotel.id, newService);
        setSelectedHotel(null);
        loadOwnerData();
    };

    const viewBookings = async (hotelId) => {
        try {
            const res = await BookingService.getHotelBookings(hotelId);
            setHotelBookings(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setHotelBookings([]);
        }
    };

    const handleDeleteHotel = async (hotelId) => {
        if (window.confirm("Are you sure you want to delete this hotel? All rooms and bookings will be permanently removed.")) {
            try {
                await HotelService.deleteHotel(hotelId);
                setHotels(hotels.filter(h => h.id !== hotelId));
                if (selectedHotel?.id === hotelId) setSelectedHotel(null);
            } catch (error) {
                alert("Failed to delete hotel.");
                console.error(error);
            }
        }
    };

    const handleDeleteBooking = async (bookingId, hotelId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await BookingService.deleteBooking(bookingId);
                // Refresh bookings
                viewBookings(hotelId);
            } catch (error) {
                alert("Failed to cancel booking.");
                console.error(error);
            }
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4 fw-bold text-primary">Owner Dashboard</h2>
            <div className="row g-4">
                {/* Create Hotel Section */}
                <div className="col-lg-4">
                    <div className="card premium-card p-4 border-0 mb-4 sticky-top" style={{ top: '20px', zIndex: 1 }}>
                        <h4 className="mb-4 text-secondary">Create New Hotel</h4>
                        <form onSubmit={handleCreateHotel}>
                            <div className="mb-3">
                                <label className="form-label small text-muted">Hotel Name</label>
                                <input type="text" className="form-control" placeholder="e.g. Grand Plaza" value={newHotel.name} onChange={e => setNewHotel({ ...newHotel, name: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small text-muted">Location</label>
                                <input type="text" className="form-control" placeholder="e.g. New York, NY" value={newHotel.location} onChange={e => setNewHotel({ ...newHotel, location: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small text-muted">Description</label>
                                <textarea className="form-control" rows="3" placeholder="Describe the amenities..." value={newHotel.description} onChange={e => setNewHotel({ ...newHotel, description: e.target.value })}></textarea>
                            </div>
                            <button className="btn btn-primary w-100 shadow-sm py-2">
                                <i className="bi bi-plus-circle me-2"></i>Create Hotel
                            </button>
                        </form>
                    </div>
                </div>

                {/* Hotel List Section */}
                <div className="col-lg-8">
                    <h4 className="mb-4 text-secondary">Your Hotels</h4>
                    <div className="row g-4">
                        {Array.isArray(hotels) && hotels.length > 0 ? hotels.map(h => (
                            <div key={h.id} className="col-md-6">
                                <div className={`card premium-card h-100 border-0 ${selectedHotel?.id === h.id ? 'ring-2 ring-primary' : ''}`}>
                                    <div className="card-body d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h5 className="card-title fw-bold mb-1">{h.name}</h5>
                                                <div className="text-muted small"><i className="bi bi-geo-alt-fill me-1"></i>{h.location}</div>
                                            </div>
                                            <button
                                                className="btn btn-outline-danger btn-sm rounded-circle"
                                                onClick={(e) => { e.stopPropagation(); handleDeleteHotel(h.id); }}
                                                title="Delete Hotel"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                        <p className="card-text small text-secondary flex-grow-1">{h.description || 'No description provided.'}</p>
                                        <div className="mt-3">
                                            <button
                                                className={`btn w-100 ${selectedHotel?.id === h.id ? 'btn-primary' : 'btn-outline-primary'}`}
                                                onClick={() => { setSelectedHotel(h); viewBookings(h.id); }}
                                            >
                                                {selectedHotel?.id === h.id ? 'Managing...' : 'Manage Hotel'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-12">
                                <div className="text-center py-5 text-muted bg-white rounded-3 shadow-sm">
                                    <i className="bi bi-building fs-1 mb-3 d-block"></i>
                                    <h5>No hotels registered yet.</h5>
                                    <p>Start by creating your first hotel on the left.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Management Section for Selected Hotel */}
                    {selectedHotel && (
                        <div className="mt-5 fade-in">
                            <hr className="my-5 opacity-25" />
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="text-primary mb-0">Managing: {selectedHotel.name}</h3>
                                <button className="btn btn-outline-secondary btn-sm" onClick={() => setSelectedHotel(null)}>Close Manager</button>
                            </div>

                            <div className="row g-4 mb-5">
                                <div className="col-md-6">
                                    <div className="card premium-card p-4 border-0 h-100">
                                        <h5 className="mb-4 text-success"><i className="bi bi-door-open me-2"></i>Add Room</h5>
                                        <form onSubmit={handleAddRoom}>
                                            <div className="mb-3">
                                                <label className="form-label small">Room Type</label>
                                                <select className="form-select" value={newRoom.type} onChange={e => setNewRoom({ ...newRoom, type: e.target.value })}>
                                                    <option value="SINGLE">Single Room</option>
                                                    <option value="DOUBLE">Double Room</option>
                                                    <option value="DELUXE">Deluxe Room</option>
                                                    <option value="SUITE">Exclusive Suite</option>
                                                </select>
                                            </div>
                                            <div className="row g-2 mb-3">
                                                <div className="col-6">
                                                    <label className="form-label small">Price ($)</label>
                                                    <input type="number" className="form-control" value={newRoom.pricePerNight} onChange={e => setNewRoom({ ...newRoom, pricePerNight: e.target.value })} required />
                                                </div>
                                                <div className="col-6">
                                                    <label className="form-label small">Count</label>
                                                    <input type="number" className="form-control" value={newRoom.totalRooms} onChange={e => setNewRoom({ ...newRoom, totalRooms: e.target.value, availableRooms: e.target.value })} required />
                                                </div>
                                            </div>
                                            <button className="btn btn-success w-100">Add Room</button>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card premium-card p-4 border-0 h-100">
                                        <h5 className="mb-4 text-info"><i className="bi bi-stars me-2"></i>Add Service</h5>
                                        <form onSubmit={handleAddService}>
                                            <div className="mb-3">
                                                <label className="form-label small">Service Name</label>
                                                <input type="text" className="form-control" placeholder="e.g. Spa, Breakfast" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} required />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label small">Price ($)</label>
                                                <input type="number" className="form-control" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })} required />
                                            </div>
                                            <button className="btn btn-info text-white w-100">Add Service</button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            {/* Bookings Section */}
                            <div className="card premium-card p-4 border-0">
                                <h5 className="mb-4"><i className="bi bi-calendar-check me-2"></i>Bookings for {selectedHotel.name}</h5>
                                {hotelBookings.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Customer</th>
                                                    <th>Room</th>
                                                    <th>Dates</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {hotelBookings.map(b => (
                                                    <tr key={b.id}>
                                                        <td><small className="text-muted">#{b.id}</small></td>
                                                        <td>
                                                            <div className="fw-bold">{b.customer?.username || 'Guest'}</div>
                                                            <div className="small text-muted">{b.customer?.email}</div>
                                                        </td>
                                                        <td><span className="badge bg-light text-dark border">{b.room?.type}</span></td>
                                                        <td className="small">
                                                            <div>In: {b.checkInDate}</div>
                                                            <div>Out: {b.checkOutDate}</div>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${b.status === 'CONFIRMED' ? 'bg-success' : 'bg-warning text-dark'}`}>{b.status}</span>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDeleteBooking(b.id, selectedHotel.id)}
                                                                title="Cancel Booking"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-muted">No bookings found for this hotel.</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
