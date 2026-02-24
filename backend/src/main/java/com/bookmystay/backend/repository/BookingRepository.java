package com.bookmystay.backend.repository;

import com.bookmystay.backend.entity.Booking;
import com.bookmystay.backend.entity.User;
import com.bookmystay.backend.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomer(User customer);
    
    @Query("SELECT b FROM Booking b JOIN FETCH b.room r JOIN FETCH r.hotel h WHERE b.customer.id = :customerId")
    List<Booking> findByCustomerIdWithDetails(@Param("customerId") Long customerId);

    @Query("SELECT b FROM Booking b JOIN FETCH b.room r JOIN FETCH r.hotel h WHERE h.id = :hotelId")
    List<Booking> findByHotelId(@Param("hotelId") Long hotelId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.room.id = :roomId AND " +
           "(b.checkInDate < :checkOut AND b.checkOutDate > :checkIn) AND " +
           "b.status != 'CANCELLED'")
    long countOverlappingBookings(@Param("roomId") Long roomId, 
                                 @Param("checkIn") LocalDate checkIn, 
                                 @Param("checkOut") LocalDate checkOut);
}
