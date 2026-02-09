package com.bookmystay.backend.repository;

import com.bookmystay.backend.entity.HotelService;
import com.bookmystay.backend.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HotelServiceRepository extends JpaRepository<HotelService, Long> {
    List<HotelService> findByHotel(Hotel hotel);
}
