package com.bookmystay.backend.service;

import com.bookmystay.backend.dto.BookingRequest;
import com.bookmystay.backend.entity.*;
import com.bookmystay.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Booking createBooking(BookingRequest request, User customer) {
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (request.getCheckOutDate().isBefore(request.getCheckInDate())) {
            throw new RuntimeException("Check-out date must be after check-in date");
        }

        // Check availability
        long overlapping = bookingRepository.countOverlappingBookings(
                request.getRoomId(), request.getCheckInDate(), request.getCheckOutDate());

        if (overlapping >= room.getTotalRooms()) {
            throw new RuntimeException("No rooms available for the selected dates");
        }

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        double totalPrice = nights * room.getPricePerNight() * request.getNumberOfRooms();

        Booking booking = Booking.builder()
                .customer(customer)
                .room(room)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .numberOfRooms(request.getNumberOfRooms())
                .totalPrice(totalPrice)
                .status(Booking.BookingStatus.PENDING)
                .build();

        return bookingRepository.save(booking);
    }

    public List<Booking> getCustomerBookings(User customer) {
        return bookingRepository.findByCustomerIdWithDetails(customer.getId());
    }

    public List<Booking> getHotelBookings(Long hotelId) {
        return bookingRepository.findByHotelId(hotelId);
    }

    @Transactional
    public void updateBookingStatus(Long bookingId, Booking.BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();
        booking.setStatus(status);
        bookingRepository.save(booking);
    }

    @Transactional
    public void deleteBooking(Long bookingId, User user) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        boolean isCustomer = booking.getCustomer().getId().equals(user.getId());
        boolean isHotelOwner = booking.getRoom().getHotel().getOwner().getId().equals(user.getId());

        if (isCustomer || isHotelOwner) {
            bookingRepository.delete(booking);
        } else {
            throw new RuntimeException("Unauthorized to delete this booking");
        }
    }
}
