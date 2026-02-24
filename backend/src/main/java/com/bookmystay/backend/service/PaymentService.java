package com.bookmystay.backend.service;

import com.bookmystay.backend.entity.*;
import com.bookmystay.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    @Transactional
    public Payment processPayment(Long bookingId, Double amount) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();
        
        Payment payment = Payment.builder()
                .booking(booking)
                .amount(amount)
                .paymentDate(LocalDateTime.now())
                .status(Payment.PaymentStatus.SUCCESS) // Simulating success
                .build();

        payment = paymentRepository.save(payment);

        // Update booking status to CONFIRMED
        bookingService.updateBookingStatus(bookingId, Booking.BookingStatus.CONFIRMED);

        return payment;
    }
}
