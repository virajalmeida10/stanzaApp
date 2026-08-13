package com.almeida.viraj01.projects.stanzaApp.controller;

import com.almeida.viraj01.projects.stanzaApp.dto.OfferDto;
import com.almeida.viraj01.projects.stanzaApp.service.OfferService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/offers")
@RequiredArgsConstructor
public class OfferController {

    private final OfferService offerService;

    @GetMapping
    @Operation(summary = "List all promotional offers", tags = {"Offers"})
    public ResponseEntity<List<OfferDto>> getOffers() {
        return ResponseEntity.ok(offerService.getAllOffers());
    }
}