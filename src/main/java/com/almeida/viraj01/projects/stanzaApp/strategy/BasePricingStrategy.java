package com.almeida.viraj01.projects.stanzaApp.strategy;

import com.almeida.viraj01.projects.stanzaApp.entity.Inventory;

import java.math.BigDecimal;

public class BasePricingStrategy implements PricingStrategy{
    @Override
    public BigDecimal calculatePrice(Inventory inventory) {
        return inventory.getRoom().getBasePrice();
    }
}
