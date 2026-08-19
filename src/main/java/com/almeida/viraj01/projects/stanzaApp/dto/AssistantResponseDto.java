package com.almeida.viraj01.projects.stanzaApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * The assistant's answer: a friendly natural-language reply plus the real,
 * grounded hotels from the database that match the extracted filters. The
 * frontend renders {@code reply} as a chat bubble and {@code hotels} as cards.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssistantResponseDto {
    private String reply;
    private List<HotelPriceResponseDto> hotels;

    // What the assistant understood from the prompt (handy to show the user / debug).
    private String city;
    private List<String> amenities;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
}