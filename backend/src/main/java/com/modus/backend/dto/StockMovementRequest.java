package com.modus.backend.dto;

import com.modus.backend.domain.entity.StockMovementType;
import java.math.BigDecimal;
import java.util.UUID;

public record StockMovementRequest(
    UUID productId,
    UUID warehouseId,
    StockMovementType type,
    BigDecimal quantity,
    String note
) {}
