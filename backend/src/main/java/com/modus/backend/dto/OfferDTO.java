package com.modus.backend.dto;

import com.modus.backend.domain.entity.OfferStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class OfferDTO {

    public record CreateRequest(
        UUID demandId,
        @NotNull UUID customerId,
        LocalDateTime validUntil,
        String currency,
        @NotEmpty List<ItemRequest> items
    ) {}

    public record ItemRequest(
        @NotNull UUID productId,
        @NotNull Integer quantity,
        @NotNull BigDecimal unitPrice,
        BigDecimal discount
    ) {}

    public record Response(
        UUID id,
        UUID demandId,
        String demandTitle,
        UUID customerId,
        String customerName,
        OfferStatus status,
        BigDecimal totalAmount,
        String currency,
        LocalDateTime validUntil,
        List<ItemResponse> items,
        LocalDateTime createdAt
    ) {}

    public record ItemResponse(
        UUID id,
        UUID productId,
        String productName,
        String productSku,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal discount,
        BigDecimal totalPrice
    ) {}
}
