package com.modus.backend.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record StockSummaryResponse(
    UUID productId,
    String productName,
    String sku,
    BigDecimal quantity
) {}
