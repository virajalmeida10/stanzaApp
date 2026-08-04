package com.almeida.viraj01.projects.stanzaApp.repository;

import com.almeida.viraj01.projects.stanzaApp.entity.Inventory;
import com.almeida.viraj01.projects.stanzaApp.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    void deleteByDateAfterAndRoom(LocalDate date, Room room);
}
