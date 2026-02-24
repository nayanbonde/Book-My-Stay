package com.bookmystay.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private LocalDateTime paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Booking booking;

    public enum PaymentStatus {
        SUCCESS,
        FAILED,
        PENDING
    }
}
