package com.modus.backend.domain.repository;

import com.modus.backend.domain.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, UUID> {

    @Query("SELECT COALESCE(SUM(CASE WHEN sm.type IN ('IN', 'TRANSFER_IN') THEN sm.quantity ELSE -sm.quantity END), 0) " +
           "FROM StockMovement sm " +
           "WHERE sm.product.id = :productId AND sm.warehouse.id = :warehouseId")
    BigDecimal findCurrentStock(@Param("productId") UUID productId, @Param("warehouseId") UUID warehouseId);

    @Query("SELECT sm.product.id AS productId, " +
           "sm.product.name AS productName, " +
           "sm.product.sku AS sku, " +
           "COALESCE(SUM(CASE WHEN sm.type IN ('IN', 'TRANSFER_IN') THEN sm.quantity ELSE -sm.quantity END), 0) AS quantity " +
           "FROM StockMovement sm " +
           "WHERE sm.warehouse.id = :warehouseId " +
           "GROUP BY sm.product.id, sm.product.name, sm.product.sku")
    List<StockSummary> findStockByWarehouse(@Param("warehouseId") UUID warehouseId);



    @Query("SELECT sm.product.id AS productId, " +
           "sm.product.name AS productName, " +
           "sm.product.sku AS sku, " +
           "COALESCE(SUM(CASE WHEN sm.type IN ('IN', 'TRANSFER_IN') THEN sm.quantity ELSE -sm.quantity END), 0) AS quantity " +
           "FROM StockMovement sm " +
           "GROUP BY sm.product.id, sm.product.name, sm.product.sku")
    List<StockSummary> findGlobalStockSummary();

    List<StockMovement> findByProductIdOrderByCreatedAtDesc(UUID productId);

    // Interface-based Projection for the Group By query
    interface StockSummary {
        UUID getProductId();
        String getProductName();
        String getSku();
        BigDecimal getQuantity();
    }
}
