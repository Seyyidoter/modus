package com.modus.backend.service;

import com.modus.backend.domain.entity.Product;
import com.modus.backend.domain.entity.StockMovement;
import com.modus.backend.domain.entity.StockMovementType;
import com.modus.backend.domain.entity.Warehouse;
import com.modus.backend.domain.repository.ProductRepository;
import com.modus.backend.domain.repository.StockMovementRepository;
import com.modus.backend.domain.repository.WarehouseRepository;
import com.modus.backend.dto.StockMovementRequest;
import com.modus.backend.dto.StockSummaryResponse;
import com.modus.backend.dto.StockTransferRequest;
import com.modus.backend.exception.InsufficientStockException;
import com.modus.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockService {

    private final StockMovementRepository stockMovementRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    @Transactional
    public void recordMovement(StockMovementRequest request) {
        validateQuantity(request.quantity());

        if (request.type() == StockMovementType.OUT) {
            validateStockAvailability(request.productId(), request.warehouseId(), request.quantity());
        }

        createMovementEntity(request.productId(), request.warehouseId(), request.type(), request.quantity(), null, request.note());
        log.info("Stock Movement Created: Type={}, Product={}, Warehouse={}, Qty={}", 
                 request.type(), request.productId(), request.warehouseId(), request.quantity());
    }

    @Transactional
    public void transferStock(StockTransferRequest request) {
        validateQuantity(request.quantity());

        // 1. Check source stock
        validateStockAvailability(request.productId(), request.sourceWarehouseId(), request.quantity());

        // 2. Generate a Transfer Group ID
        UUID transferGroupId = UUID.randomUUID();

        // 3. Create OUT movement
        createMovementEntity(
                request.productId(),
                request.sourceWarehouseId(),
                StockMovementType.TRANSFER_OUT,
                request.quantity(),
                transferGroupId,
                "Transfer to " + request.targetWarehouseId() + ": " + request.note()
        );

        // 4. Create IN movement
        createMovementEntity(
                request.productId(),
                request.targetWarehouseId(),
                StockMovementType.TRANSFER_IN,
                request.quantity(),
                transferGroupId,
                "Transfer from " + request.sourceWarehouseId() + ": " + request.note()
        );
        log.info("Transfer Executed: GroupId={}, Source={}, Target={}, Qty={}", 
                 transferGroupId, request.sourceWarehouseId(), request.targetWarehouseId(), request.quantity());
    }

    public List<StockSummaryResponse> getStockOverview(UUID warehouseId) {
        return stockMovementRepository.findStockByWarehouse(warehouseId).stream()
                .map(s -> new StockSummaryResponse(
                        s.getProductId(),
                        s.getProductName(),
                        s.getSku(),
                        s.getQuantity()
                ))
                .collect(Collectors.toList());
    }



    public List<StockSummaryResponse> getGlobalStockOverview() {
        return stockMovementRepository.findGlobalStockSummary().stream()
                .map(s -> new StockSummaryResponse(
                        s.getProductId(),
                        s.getProductName(),
                        s.getSku(),
                        s.getQuantity()
                ))
                .collect(Collectors.toList());
    }

    public BigDecimal getCurrentStock(UUID productId, UUID warehouseId) {
        return stockMovementRepository.findCurrentStock(productId, warehouseId);
    }

    private void createMovementEntity(UUID productId, UUID warehouseId, StockMovementType type, BigDecimal quantity, UUID transferGroupId, String note) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));

        StockMovement movement = StockMovement.builder()
                .product(product)
                .warehouse(warehouse)
                .type(type)
                .quantity(quantity)
                .transferGroupId(transferGroupId)
                .note(note)
                .build();

        stockMovementRepository.save(movement);
    }

    private void validateStockAvailability(UUID productId, UUID warehouseId, BigDecimal requiredQuantity) {
        BigDecimal currentStock = stockMovementRepository.findCurrentStock(productId, warehouseId);
        if (currentStock.compareTo(requiredQuantity) < 0) {
            throw new InsufficientStockException("Insufficient stock. Current: " + currentStock + ", Required: " + requiredQuantity);
        }
    }

    private void validateQuantity(BigDecimal quantity) {
        if (quantity == null || quantity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
    }

    public List<com.modus.backend.dto.StockMovementResponse> getHistory(UUID productId) {
        return stockMovementRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(m -> new com.modus.backend.dto.StockMovementResponse(
                        m.getId(),
                        m.getProduct().getName(),
                        m.getWarehouse().getName(),
                        m.getType(),
                        m.getQuantity(),
                        m.getNote(),
                        m.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}
