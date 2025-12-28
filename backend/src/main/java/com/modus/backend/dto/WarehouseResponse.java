package com.modus.backend.dto;

import java.time.Instant;
import java.util.UUID;

public record WarehouseResponse(
    UUID id,
    String name,
    String location,
    boolean active,
    Instant createdAt
) {}
