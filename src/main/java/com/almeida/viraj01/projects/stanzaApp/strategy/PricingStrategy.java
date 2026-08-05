package com.almeida.viraj01.projects.stanzaApp.strategy;

import com.almeida.viraj01.projects.stanzaApp.entity.Inventory;

import java.math.BigDecimal;
public interface PricingStrategy {

    BigDecimal calculatePrice(Inventory inventory);
}
