package com.almeida.viraj01.projects.stanzaApp.dto;

import com.almeida.viraj01.projects.stanzaApp.entity.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingStatusResponseDto {
    private BookingStatus bookingStatus;
}
