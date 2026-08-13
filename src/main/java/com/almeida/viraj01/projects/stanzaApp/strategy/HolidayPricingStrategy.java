package com.almeida.viraj01.projects.stanzaApp.strategy;

import com.almeida.viraj01.projects.stanzaApp.entity.Inventory;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

@RequiredArgsConstructor
public class HolidayPricingStrategy implements PricingStrategy {

    private final PricingStrategy wrapped;

    @Override
    public BigDecimal calculatePrice(Inventory inventory) {
        BigDecimal price = wrapped.calculatePrice(inventory);

        // TODO: replace with a real holiday-calendar lookup for inventory.getDate().
        boolean isTodayHoliday = false;
        if (isTodayHoliday) {
            price = price.multiply(BigDecimal.valueOf(1.25));
        }
        return price;
    }
}