import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import HotelService from '../services/hotel.service';

const HotelDetails = () => {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        HotelService.getHotelById(id)
            .then(res => {
                setHotel(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
    if (!hotel) return <div className="alert alert-danger">Hotel not found!</div>;

    return (
        <div className="row">
            <div className="col-md-8">
                <div className="card premium-card mb-4">
                    <div className="card-body">
                        <h2>{hotel.name}</h2>
                        <p className="text-muted"><i className="bi bi-geo-alt"></i> {hotel.location}</p>
                        <p>{hotel.description}</p>
                    </div>
                </div>

                <h4>Available Rooms</h4>
                <div className="row g-3">
                    {hotel.rooms?.map(room => (
                        <div key={room.id} className="col-md-6">
                            <div className="card premium-card">
                                <div className="card-body">
                                    <h5>{room.type}</h5>
                                    <p className="text-primary fw-bold">${room.pricePerNight} / Night</p>
                                    <p className="small text-muted">Availability: {room.availableRooms} / {room.totalRooms} rooms</p>
                                    <Link to={`/book/${room.id}`} className="btn btn-success btn-sm w-100 mt-2">Book Now</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="col-md-4">
                <div className="card premium-card mb-4">
                    <div className="card-body">
                        <h4>Services</h4>
                        <ul className="list-group list-group-flush bg-transparent">
                            {hotel.services?.length > 0 ? hotel.services.map(service => (
                                <li key={service.id} className="list-group-item bg-transparent d-flex justify-content-between align-items-center">
                                    {service.name}
                                    <span className="badge bg-primary rounded-pill">${service.price}</span>
                                </li>
                            )) : <li className="list-group-item bg-transparent">No services listed</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;
