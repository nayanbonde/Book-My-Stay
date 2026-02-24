package com.bookmystay.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingRequest {
    private Long roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numberOfRooms;
}
