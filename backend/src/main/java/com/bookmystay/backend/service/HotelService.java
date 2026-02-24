package com.bookmystay.backend.service;

import com.bookmystay.backend.entity.*;
import com.bookmystay.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private HotelServiceRepository serviceRepository;

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public Hotel getHotelById(Long id) {
        return hotelRepository.findById(id).orElseThrow(() -> new RuntimeException("Hotel not found"));
    }

    public Hotel createHotel(Hotel hotel, User owner) {
        hotel.setOwner(owner);
        return hotelRepository.save(hotel);
    }

    public Room addRoomToHotel(Long hotelId, Room room) {
        Hotel hotel = getHotelById(hotelId);
        room.setHotel(hotel);
        return roomRepository.save(room);
    }

    public com.bookmystay.backend.entity.HotelService addServiceToHotel(Long hotelId, com.bookmystay.backend.entity.HotelService service) {
        Hotel hotel = getHotelById(hotelId);
        service.setHotel(hotel);
        return serviceRepository.save(service);
    }

    public List<Hotel> getHotelsByOwner(User owner) {
        return hotelRepository.findByOwner(owner);
    }

    public void deleteHotel(Long hotelId, User owner) {
        Hotel hotel = getHotelById(hotelId);
        if (!hotel.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Unauthorized to delete this hotel");
        }
        hotelRepository.delete(hotel);
    }
}
