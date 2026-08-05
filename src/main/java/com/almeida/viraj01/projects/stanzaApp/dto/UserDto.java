package com.almeida.viraj01.projects.stanzaApp.dto;

import com.almeida.viraj01.projects.stanzaApp.entity.enums.Gender;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserDto {
    private Long id;
    private String email;
    private String name;
    private Gender gender;
    private LocalDate dateOfBirth;
}
