package com.modus.backend.dto;

import com.modus.backend.domain.entity.DemandStatus;
import com.modus.backend.domain.entity.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class DemandDTO {

    public record Request(
        @NotBlank String title,
        String description,
        String requesterName,
        @NotNull Priority priority,
        LocalDateTime dueDate,
        @NotEmpty List<ItemRequest> items
    ) {}

    public record ItemRequest(
        @NotNull UUID productId,
        @NotNull Integer quantity,
        String note
    ) {}

    public record Response(
        UUID id,
        String title,
        String description,
        String requesterName,
        DemandStatus status,
        Priority priority,
        LocalDateTime dueDate,
        List<ItemResponse> items,
        LocalDateTime createdAt
    ) {}

    public record ItemResponse(
        UUID id,
        UUID productId,
        String productName,
        String productSku,
        Integer quantity,
        String note
    ) {}
}
