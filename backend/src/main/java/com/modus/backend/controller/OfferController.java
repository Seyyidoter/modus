package com.modus.backend.controller;

import com.modus.backend.domain.entity.OfferStatus;
import com.modus.backend.dto.OfferDTO;
import com.modus.backend.service.OfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/offers")
@RequiredArgsConstructor
public class OfferController {

    private final OfferService offerService;

    @GetMapping
    public List<OfferDTO.Response> getAllOffers() {
        return offerService.getAllOffers();
    }

    @GetMapping("/{id}")
    public OfferDTO.Response getOffer(@PathVariable UUID id) {
        return offerService.getOffer(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OfferDTO.Response createOffer(@Valid @RequestBody OfferDTO.CreateRequest request) {
        return offerService.createOffer(request);
    }

    @PatchMapping("/{id}/status")
    public OfferDTO.Response updateStatus(@PathVariable UUID id, @RequestParam OfferStatus status) {
        return offerService.updateStatus(id, status);
    }
}
