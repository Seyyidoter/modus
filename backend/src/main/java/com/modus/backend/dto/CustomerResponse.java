package com.modus.backend.dto;

import com.modus.backend.domain.entity.CustomerType;
import java.time.LocalDateTime;
import java.util.UUID;

public record CustomerResponse(
    UUID id,
    String name,
    String email,
    String phone,
    String address,
    String taxId,
    CustomerType type,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
