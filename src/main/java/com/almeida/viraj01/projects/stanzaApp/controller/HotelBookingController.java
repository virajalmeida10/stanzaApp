package com.almeida.viraj01.projects.stanzaApp.controller;

import com.almeida.viraj01.projects.stanzaApp.dto.BookingDto;
import com.almeida.viraj01.projects.stanzaApp.dto.BookingPaymentInitResponseDto;
import com.almeida.viraj01.projects.stanzaApp.dto.BookingRequest;
import com.almeida.viraj01.projects.stanzaApp.dto.BookingStatusResponseDto;
import com.almeida.viraj01.projects.stanzaApp.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/bookings")
public class HotelBookingController {

    private final BookingService bookingService;

    @PostMapping("/init")
    @Operation(summary = "Initiate the booking", tags = {"Booking Flow"})
    public ResponseEntity<BookingDto> initialiseBooking(@RequestBody BookingRequest bookingRequest) {
        return ResponseEntity.ok(bookingService.initialiseBooking(bookingRequest));
    }

    @PostMapping("/{bookingId}/addGuests")
    @Operation(summary = "Add guest Ids to the booking", tags = {"Booking Flow"})
    public ResponseEntity<BookingDto> addGuests(@PathVariable Long bookingId,
                                                @RequestBody List<Long> guestIdList) {
        return ResponseEntity.ok(bookingService.addGuests(bookingId, guestIdList));
    }

    @PostMapping("/{bookingId}/payments")
    @Operation(summary = "Initiate payments flow for the booking", tags = {"Booking Flow"})
    public ResponseEntity<BookingPaymentInitResponseDto> initiatePayment(@PathVariable Long bookingId) {
        String sessionUrl = bookingService.initiatePayments(bookingId);
        return ResponseEntity.ok(new BookingPaymentInitResponseDto(sessionUrl));
    }

    @PostMapping("/{bookingId}/cancel")
    @Operation(summary = "Cancel the booking", tags = {"Booking Flow"})
    public ResponseEntity<Void> cancelBooking(@PathVariable Long bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{bookingId}/status")
    @Operation(summary = "Check the status of the booking", tags = {"Booking Flow"})
    public ResponseEntity<BookingStatusResponseDto> getBookingStatus(@PathVariable Long bookingId) {
        return ResponseEntity.ok(new BookingStatusResponseDto(bookingService.getBookingStatus(bookingId)));
    }

    @DeleteMapping("/{bookingId}")
    @Operation(summary = "Cancel/remove an unpaid booking and free the room", tags = {"Booking Flow"})
    public ResponseEntity<Void> cancelUnpaidBooking(@PathVariable Long bookingId) {
        bookingService.cancelUnpaidBooking(bookingId);
        return ResponseEntity.noContent().build();
    }
}