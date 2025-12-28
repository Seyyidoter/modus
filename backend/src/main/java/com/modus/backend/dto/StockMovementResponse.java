package com.modus.backend.dto;

import com.modus.backend.domain.entity.StockMovementType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record StockMovementResponse(
        UUID id,
        String productName,
        String warehouseName,
        StockMovementType type,
        BigDecimal quantity,
        String note,
        Instant createdAt
) {
}
