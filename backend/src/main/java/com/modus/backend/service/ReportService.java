package com.modus.backend.service;

import com.modus.backend.domain.entity.DemandStatus;
import com.modus.backend.domain.entity.OfferStatus;
import com.modus.backend.domain.repository.CustomerRepository;
import com.modus.backend.domain.repository.DemandRepository;
import com.modus.backend.domain.repository.OfferRepository;
import com.modus.backend.domain.repository.ProductRepository;
import com.modus.backend.dto.ReportDTO;
import com.modus.backend.dto.StockSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final DemandRepository demandRepository;
    private final OfferRepository offerRepository;
    private final StockService stockService;

    public ReportDTO.DashboardData getDashboardData() {
        long totalProducts = productRepository.count();
        long totalCustomers = customerRepository.count();
        long pendingDemands = demandRepository.countByStatus(DemandStatus.PENDING);
        BigDecimal totalAcceptedOfferValue = offerRepository.sumTotalAmountByStatus(OfferStatus.ACCEPTED);

        // Logic for Low Stock: Get all stock, filter by quantity < 10
        List<ReportDTO.LowStockItem> lowStockItems = stockService.getGlobalStockOverview().stream()
                .filter(s -> s.quantity().longValue() < 10)
                .map(s -> new ReportDTO.LowStockItem(
                        s.productId(),
                        s.productName(),
                        s.sku(),
                        s.quantity().longValue()
                ))
                .limit(5)
                .collect(Collectors.toList());
        
        // Placeholder for recent activities (could be fetched from StockMovements later)
        List<ReportDTO.RecentActivity> recentActivities = List.of(
            new ReportDTO.RecentActivity("System started", "Just now")
        );

        return new ReportDTO.DashboardData(
                totalProducts,
                totalCustomers,
                pendingDemands,
                totalAcceptedOfferValue,
                lowStockItems,
                recentActivities
        );
    }
}
