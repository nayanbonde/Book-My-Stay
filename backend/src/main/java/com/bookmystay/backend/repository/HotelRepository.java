package com.bookmystay.backend.repository;

import com.bookmystay.backend.entity.Hotel;
import com.bookmystay.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByOwner(User owner);
    List<Hotel> findByLocationContainingIgnoreCase(String location);
}
