package com.modus.backend.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class ReportDTO {

    public record DashboardData(
        long totalProducts,
        long totalCustomers,
        long pendingDemands,
        BigDecimal totalAcceptedOfferValue,
        List<LowStockItem> lowStockItems,
        List<RecentActivity> recentActivities
    ) {}

    public record LowStockItem(
        UUID productId,
        String productName,
        String sku,
        long quantity
    ) {}

    public record RecentActivity(
        String description,
        String timestamp
    ) {}
}
