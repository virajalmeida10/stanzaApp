package com.almeida.viraj01.projects.stanzaApp.repository;

import com.almeida.viraj01.projects.stanzaApp.dto.HotelPriceDto;
import com.almeida.viraj01.projects.stanzaApp.entity.Hotel;
import com.almeida.viraj01.projects.stanzaApp.entity.HotelMinPrice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface HotelMinPriceRepository extends JpaRepository<HotelMinPrice, Long> {

    @Query(value = """
            SELECT new com.almeida.viraj01.projects.stanzaApp.dto.HotelPriceDto(i.hotel, AVG(i.price))
            FROM HotelMinPrice i
            WHERE (:city IS NULL OR i.hotel.city = :city)
                AND i.date BETWEEN :startDate AND :endDate
                AND i.hotel.active = true
           GROUP BY i.hotel
           ORDER BY i.hotel.name
           """,
            countQuery = """
            SELECT COUNT(DISTINCT i.hotel)
            FROM HotelMinPrice i
            WHERE (:city IS NULL OR i.hotel.city = :city)
                AND i.date BETWEEN :startDate AND :endDate
                AND i.hotel.active = true
           """)
    Page<HotelPriceDto> findHotelsWithAvailableInventory(
            @Param("city") String city,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("roomsCount") Integer roomsCount,
            @Param("dateCount") Long dateCount,
            Pageable pageable
    );

    Optional<HotelMinPrice> findByHotelAndDate(Hotel hotel, LocalDate date);
}