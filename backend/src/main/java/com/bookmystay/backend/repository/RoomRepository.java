package com.bookmystay.backend.repository;

import com.bookmystay.backend.entity.Room;
import com.bookmystay.backend.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotel(Hotel hotel);
}
