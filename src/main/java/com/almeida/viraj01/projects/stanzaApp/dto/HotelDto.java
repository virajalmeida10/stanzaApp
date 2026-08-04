package com.almeida.viraj01.projects.stanzaApp.dto;

import com.almeida.viraj01.projects.stanzaApp.entity.HotelContactInfo;
import lombok.Data;

@Data
public class HotelDto {
    private Long id;
    private String name;
    private String city;
    private String[] photos;
    private String[] amenities;
    private HotelContactInfo contactInfo;
    private Boolean active;
}
