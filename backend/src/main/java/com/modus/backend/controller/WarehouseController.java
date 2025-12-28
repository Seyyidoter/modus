package com.modus.backend.controller;

import com.modus.backend.dto.WarehouseRequest;
import com.modus.backend.dto.WarehouseResponse;
import com.modus.backend.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/warehouses")
@RequiredArgsConstructor
@CrossOrigin
public class WarehouseController {

    private final WarehouseService warehouseService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WarehouseResponse createWarehouse(@RequestBody WarehouseRequest request) {
        return warehouseService.createWarehouse(request);
    }

    @GetMapping
    public List<WarehouseResponse> getAllWarehouses() {
        return warehouseService.getAllWarehouses();
    }
}
