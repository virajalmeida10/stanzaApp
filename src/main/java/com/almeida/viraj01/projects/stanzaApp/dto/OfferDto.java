package com.almeida.viraj01.projects.stanzaApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OfferDto {
    private String code;
    private String title;
    private String description;
    private Integer discountPercent;
    private List<String> cities;   // empty = applies to all cities
    private String image;
}