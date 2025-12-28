package com.modus.backend.dto;

import java.math.BigDecimal;

public record ProductRequest(
    String sku,
    String name,
    String description,
    String unit,
    BigDecimal unitPrice
) {}
