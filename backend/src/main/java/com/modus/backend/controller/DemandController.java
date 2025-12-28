package com.modus.backend.controller;

import com.modus.backend.domain.entity.DemandStatus;
import com.modus.backend.dto.DemandDTO;
import com.modus.backend.service.DemandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/demands")
@RequiredArgsConstructor
public class DemandController {

    private final DemandService demandService;

    @GetMapping
    public List<DemandDTO.Response> getAllDemands() {
        return demandService.getAllDemands();
    }

    @GetMapping("/{id}")
    public DemandDTO.Response getDemand(@PathVariable UUID id) {
        return demandService.getDemand(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DemandDTO.Response createDemand(@Valid @RequestBody DemandDTO.Request request) {
        return demandService.createDemand(request);
    }

    @PatchMapping("/{id}/status")
    public DemandDTO.Response updateStatus(@PathVariable UUID id, @RequestParam DemandStatus status) {
        return demandService.updateStatus(id, status);
    }
}
