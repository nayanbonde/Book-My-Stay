package com.bookmystay.backend.controller;

import com.bookmystay.backend.dto.BookingRequest;
import com.bookmystay.backend.entity.Booking;
import com.bookmystay.backend.entity.User;
import com.bookmystay.backend.repository.UserRepository;
import com.bookmystay.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest request, Authentication authentication) {
        User customer = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(bookingService.createBooking(request, customer));
    }

    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<Booking> getCustomerBookings(Authentication authentication) {
        User customer = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return bookingService.getCustomerBookings(customer);
    }

    @GetMapping("/hotel/{hotelId}")
    @PreAuthorize("hasRole('HOTEL_OWNER')")
    public List<Booking> getHotelBookings(@PathVariable Long hotelId) {
        return bookingService.getHotelBookings(hotelId);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('HOTEL_OWNER')")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        bookingService.deleteBooking(id, user);
        return ResponseEntity.noContent().build();
    }
}
