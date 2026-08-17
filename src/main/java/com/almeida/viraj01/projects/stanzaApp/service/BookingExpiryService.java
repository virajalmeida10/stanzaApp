package com.almeida.viraj01.projects.stanzaApp.service;

import com.almeida.viraj01.projects.stanzaApp.entity.Booking;
import com.almeida.viraj01.projects.stanzaApp.entity.enums.BookingStatus;
import com.almeida.viraj01.projects.stanzaApp.repository.BookingRepository;
import com.almeida.viraj01.projects.stanzaApp.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingExpiryService {

    private final BookingRepository bookingRepository;
    private final InventoryRepository inventoryRepository;

    private static final int PAYMENT_HOLD_MINUTES = 30;   // held after reaching the Stripe page
    private static final int CART_HOLD_HOURS = 24;        // a reserved item that never went to payment (the "cart")

    @Scheduled(fixedRate = 60_000) // runs once a minute
    @Transactional
    public void expireStaleBookings() {
        LocalDateTime now = LocalDateTime.now();

        expireAndRelease(bookingRepository.findByBookingStatusAndUpdatedAtBefore(
                BookingStatus.PAYMENTS_PENDING, now.minusMinutes(PAYMENT_HOLD_MINUTES)));

        expireAndRelease(bookingRepository.findByBookingStatusAndCreatedAtBefore(
                BookingStatus.RESERVED, now.minusHours(CART_HOLD_HOURS)));
        expireAndRelease(bookingRepository.findByBookingStatusAndCreatedAtBefore(
                BookingStatus.GUESTS_ADDED, now.minusHours(CART_HOLD_HOURS)));
    }

    private void expireAndRelease(List<Booking> bookings) {
        for (Booking booking : bookings) {
            inventoryRepository.releaseReservedInventory(booking.getRoom().getId(), booking.getCheckInDate(),
                    booking.getCheckOutDate(), booking.getRoomsCount());
            booking.setBookingStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);
            log.info("Expired unpaid booking {} and released its room", booking.getId());
        }
    }
}