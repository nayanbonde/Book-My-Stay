import api from "./api";

const createBooking = (data) => api.post("/bookings", data);
const getCustomerBookings = () => api.get("/bookings/customer");
const getHotelBookings = (hotelId) => api.get(`/bookings/hotel/${hotelId}`);
const deleteBooking = (id) => api.delete(`/bookings/${id}`);

const BookingService = {
    createBooking,
    getCustomerBookings,
    getHotelBookings,
    deleteBooking,
};

export default BookingService;
