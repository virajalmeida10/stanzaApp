package com.almeida.viraj01.projects.stanzaApp.repository;

import com.almeida.viraj01.projects.stanzaApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
