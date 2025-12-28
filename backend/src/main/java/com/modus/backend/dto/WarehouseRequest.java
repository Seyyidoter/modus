package com.modus.backend.dto;

public record WarehouseRequest(
    String name,
    String location,
    boolean active
) {}
