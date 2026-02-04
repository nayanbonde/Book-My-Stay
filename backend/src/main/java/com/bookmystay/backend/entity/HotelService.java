package com.bookmystay.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hotel_services")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    private Double price;

    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"rooms", "services"})
    private Hotel hotel;
}
