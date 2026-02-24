import api from "./api";

const getAllHotels = () => api.get("/hotels");
const getHotelById = (id) => api.get(`/hotels/${id}`);
const createHotel = (data) => api.post("/hotels", data);
const addRoom = (hotelId, data) => api.post(`/hotels/${hotelId}/rooms`, data);
const addService = (hotelId, data) => api.post(`/hotels/${hotelId}/services`, data);
const getOwnerHotels = () => api.get("/hotels/owner");
const deleteHotel = (id) => api.delete(`/hotels/${id}`);

const HotelService = {
    getAllHotels,
    getHotelById,
    createHotel,
    addRoom,
    addService,
    getOwnerHotels,
    deleteHotel,
};

export default HotelService;
