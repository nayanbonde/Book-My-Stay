import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HotelService from '../services/hotel.service';

const Home = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        HotelService.getAllHotels()
            .then(res => {
                setHotels(Array.isArray(res.data) ? res.data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div>
            <div className="jumbotron bg-dark text-white p-5 mb-4 rounded-3 premium-card">
                <h1 className="display-4">Find Your Perfect Stay</h1>
                <p className="lead">Experience luxury and comfort at the best hotels.</p>
            </div>

            <div className="row g-4">
                {Array.isArray(hotels) && hotels.length > 0 ? hotels.map(hotel => (
                    <div key={hotel.id} className="col-md-4">
                        <div className="card h-100 premium-card">
                            <div className="card-body">
                                <h5 className="card-title">{hotel.name}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{hotel.location}</h6>
                                <p className="card-text text-truncate">{hotel.description}</p>
                                <div className="d-grid gap-2">
                                    <Link to={`/hotel/${hotel.id}`} className="btn btn-outline-primary">View More</Link>
                                    <Link to={`/hotel/${hotel.id}`} className="btn btn-primary">Book Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-12 text-center mt-5">
                        <h3>No hotels found at the moment.</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
