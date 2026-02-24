package com.bookmystay.backend.controller;

import com.bookmystay.backend.entity.*;
import com.bookmystay.backend.repository.UserRepository;
import com.bookmystay.backend.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/hotels")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Hotel> getAllHotels() {
        return hotelService.getAllHotels();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('HOTEL_OWNER')")
    public ResponseEntity<Hotel> createHotel(@RequestBody Hotel hotel, Authentication authentication) {
        User owner = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(hotelService.createHotel(hotel, owner));
    }

    @PostMapping("/{id}/rooms")
    @PreAuthorize("hasRole('HOTEL_OWNER')")
    public ResponseEntity<Room> addRoom(@PathVariable Long id, @RequestBody Room room) {
        return ResponseEntity.ok(hotelService.addRoomToHotel(id, room));
    }

    @PostMapping("/{id}/services")
    @PreAuthorize("hasRole('HOTEL_OWNER')")
    public ResponseEntity<com.bookmystay.backend.entity.HotelService> addService(@PathVariable Long id, @RequestBody com.bookmystay.backend.entity.HotelService service) {
        return ResponseEntity.ok(hotelService.addServiceToHotel(id, service));
    }

    @GetMapping("/owner")
    @PreAuthorize("hasRole('HOTEL_OWNER')")
    public List<Hotel> getOwnerHotels(Authentication authentication) {
        User owner = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return hotelService.getHotelsByOwner(owner);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HOTEL_OWNER')")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id, Authentication authentication) {
        User owner = userRepository.findByEmail(authentication.getName()).orElseThrow();
        hotelService.deleteHotel(id, owner);
        return ResponseEntity.noContent().build();
    }
}
