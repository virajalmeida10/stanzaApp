package com.almeida.viraj01.projects.stanzaApp.service;

import com.almeida.viraj01.projects.stanzaApp.dto.OfferDto;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OfferService {

    // Static, server-side catalog (authoritative). Codes must match the frontend offers.
    private static final List<OfferDto> OFFERS = List.of(
            new OfferDto("FIRST35", "First Booking Bonanza",
                    "Up to 35% OFF on your very first stay.", 35,
                    List.of(),
                    "https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&q=70"),
            new OfferDto("SUMMER25", "Summer Escape",
                    "25% OFF on beach & resort towns.", 25,
                    List.of("Miami", "San Diego", "Honolulu", "Key West", "Myrtle Beach", "Virginia Beach", "Charleston"),
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=70"),
            new OfferDto("CITY20", "City Break",
                    "20% OFF on top city stays.", 20,
                    List.of("New York", "Chicago", "Boston", "San Francisco", "Washington", "Philadelphia"),
                    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=70"),
            new OfferDto("VEGAS15", "Desert & Vegas Nights",
                    "15% OFF across the Southwest.", 15,
                    List.of("Las Vegas", "Phoenix", "Scottsdale", "Tucson", "Santa Fe", "Albuquerque"),
                    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=70"),
            new OfferDto("WEEKEND18", "Weekend Getaway",
                    "18% OFF on quick weekend trips.", 18,
                    List.of(),
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=70")
    );

    private static final Map<String, OfferDto> BY_CODE =
            OFFERS.stream().collect(Collectors.toMap(OfferDto::getCode, o -> o));

    public List<OfferDto> getAllOffers() {
        return OFFERS;
    }

    public Optional<OfferDto> findByCode(String code) {
        return code == null ? Optional.empty() : Optional.ofNullable(BY_CODE.get(code));
    }

    // Returns the discounted amount if the offer exists and covers the hotel's city; else the original.
    public BigDecimal applyOffer(String offerCode, String hotelCity, BigDecimal amount) {
        return findByCode(offerCode)
                .filter(o -> o.getCities().isEmpty() || o.getCities().contains(hotelCity))
                .map(o -> amount
                        .multiply(BigDecimal.valueOf(100 - o.getDiscountPercent()))
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP))
                .orElse(amount);
    }
}