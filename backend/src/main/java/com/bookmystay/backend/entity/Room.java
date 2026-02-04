package com.bookmystay.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // e.g., DELUXE, SUITE, SINGLE

    @Column(nullable = false)
    private Double pricePerNight;

    @Column(nullable = false)
    private Integer totalRooms;

    @Column(nullable = false)
    private Integer availableRooms;

    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"rooms", "services"})
    private Hotel hotel;
}
