package com.modus.backend.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ProductResponse(
    UUID id,
    String sku,
    String name,
    String description,
    String unit,
    BigDecimal unitPrice,
    Instant createdAt,
    Instant updatedAt
) {}
