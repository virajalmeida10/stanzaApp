package com.almeida.viraj01.projects.stanzaApp.repository;

import com.almeida.viraj01.projects.stanzaApp.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
}
