package com.almeida.viraj01.projects.stanzaApp.repository;

import com.almeida.viraj01.projects.stanzaApp.entity.Guest;
import com.almeida.viraj01.projects.stanzaApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuestRepository extends JpaRepository<Guest, Long> {
    List<Guest> findByUser(User user);
}