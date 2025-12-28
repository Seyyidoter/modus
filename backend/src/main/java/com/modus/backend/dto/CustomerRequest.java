package com.modus.backend.dto;

import com.modus.backend.domain.entity.CustomerType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CustomerRequest(
    @NotBlank(message = "Name is required") String name,
    String email,
    String phone,
    String address,
    String taxId,
    @NotNull(message = "Type is required") CustomerType type
) {}
