package com.modus.backend.controller;

import com.modus.backend.dto.StockSummaryResponse;
import com.modus.backend.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/stock")
@RequiredArgsConstructor
@CrossOrigin
public class StockQueryController {

    private final StockService stockService;

    @GetMapping
    public List<StockSummaryResponse> getStockOverview(@RequestParam UUID warehouseId) {
        return stockService.getStockOverview(warehouseId);
    }

    @GetMapping("/{productId}")
    public BigDecimal getCurrentStock(@PathVariable UUID productId, @RequestParam UUID warehouseId) {
        return stockService.getCurrentStock(productId, warehouseId);
    }
}
