package com.modus.backend.controller;

import com.modus.backend.dto.StockTransferRequest;
import com.modus.backend.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/stock/transfers")
@RequiredArgsConstructor
@CrossOrigin
public class StockTransferController {

    private final StockService stockService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createTransfer(@RequestBody StockTransferRequest request) {
        stockService.transferStock(request);
    }
}
