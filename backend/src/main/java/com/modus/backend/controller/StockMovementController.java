package com.modus.backend.controller;

import com.modus.backend.dto.StockMovementRequest;
import com.modus.backend.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/stock/movements")
@RequiredArgsConstructor
@CrossOrigin
public class StockMovementController {

    private final StockService stockService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createMovement(@RequestBody StockMovementRequest request) {
        stockService.recordMovement(request);
    }

    @GetMapping
    public java.util.List<com.modus.backend.dto.StockMovementResponse> getHistory(@RequestParam java.util.UUID productId) {
        return stockService.getHistory(productId);
    }
}
