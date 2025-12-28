package com.modus.backend.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record StockTransferRequest(
    UUID productId,
    UUID sourceWarehouseId,
    UUID targetWarehouseId,
    BigDecimal quantity,
    String note
) {}
