package com.modus.backend.service;

import com.modus.backend.domain.entity.Warehouse;
import com.modus.backend.domain.repository.WarehouseRepository;
import com.modus.backend.dto.WarehouseRequest;
import com.modus.backend.dto.WarehouseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    public WarehouseResponse createWarehouse(WarehouseRequest request) {
        Warehouse warehouse = Warehouse.builder()
                .name(request.name())
                .location(request.location())
                .active(request.active())
                .build();

        return mapToResponse(warehouseRepository.save(warehouse));
    }

    public List<WarehouseResponse> getAllWarehouses() {
        return warehouseRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private WarehouseResponse mapToResponse(Warehouse warehouse) {
        return new WarehouseResponse(
                warehouse.getId(),
                warehouse.getName(),
                warehouse.getLocation(),
                warehouse.isActive(),
                warehouse.getCreatedAt()
        );
    }
}
