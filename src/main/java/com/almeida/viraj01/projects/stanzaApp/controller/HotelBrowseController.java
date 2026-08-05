package com.almeida.viraj01.projects.stanzaApp.controller;

import com.almeida.viraj01.projects.stanzaApp.dto.HotelInfoDto;
import com.almeida.viraj01.projects.stanzaApp.dto.HotelInfoRequestDto;
import com.almeida.viraj01.projects.stanzaApp.dto.HotelPriceResponseDto;
import com.almeida.viraj01.projects.stanzaApp.dto.HotelSearchRequest;
import com.almeida.viraj01.projects.stanzaApp.service.HotelService;
import com.almeida.viraj01.projects.stanzaApp.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/hotels")
@RequiredArgsConstructor
public class HotelBrowseController {

    private final InventoryService inventoryService;
    private final HotelService hotelService;

    @GetMapping("/search")
    @Operation(summary = "Search hotels", tags = {"Browse Hotels"})
    public ResponseEntity<Page<HotelPriceResponseDto>> searchHotels(@RequestBody HotelSearchRequest hotelSearchRequest) {

        var page = inventoryService.searchHotels(hotelSearchRequest);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{hotelId}/info")
    @Operation(summary = "Get a hotel info by hotelId", tags = {"Browse Hotels"})
    public ResponseEntity<HotelInfoDto> getHotelInfo(@PathVariable Long hotelId, @RequestBody HotelInfoRequestDto hotelInfoRequestDto) {
        return ResponseEntity.ok(hotelService.getHotelInfoById(hotelId, hotelInfoRequestDto));
    }

}