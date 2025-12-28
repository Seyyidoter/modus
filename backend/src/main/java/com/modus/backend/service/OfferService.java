package com.modus.backend.service;

import com.modus.backend.domain.entity.*;
import com.modus.backend.domain.repository.CustomerRepository;
import com.modus.backend.domain.repository.DemandRepository;
import com.modus.backend.domain.repository.OfferRepository;
import com.modus.backend.domain.repository.ProductRepository;
import com.modus.backend.dto.OfferDTO;
import com.modus.backend.exception.BusinessException;
import com.modus.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;
    private final DemandRepository demandRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public List<OfferDTO.Response> getAllOffers() {
        return offerRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public OfferDTO.Response getOffer(UUID id) {
        return offerRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found: " + id));
    }

    @Transactional
    public OfferDTO.Response createOffer(OfferDTO.CreateRequest request) {
        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + request.customerId()));

        Demand demand = null;
        if (request.demandId() != null) {
            demand = demandRepository.findById(request.demandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Demand not found: " + request.demandId()));
        }

        Offer offer = Offer.builder()
                .demand(demand)
                .customer(customer)
                .status(OfferStatus.DRAFT)
                .validUntil(request.validUntil())
                .currency(request.currency() != null ? request.currency() : "USD")
                .totalAmount(BigDecimal.ZERO)
                .build();

        List<OfferItem> items = request.items().stream().map(itemReq -> {
            Product product = productRepository.findById(itemReq.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemReq.productId()));

            BigDecimal discount = itemReq.discount() != null ? itemReq.discount() : BigDecimal.ZERO;
            BigDecimal total = itemReq.unitPrice()
                    .multiply(BigDecimal.valueOf(itemReq.quantity()))
                    .subtract(discount);

            return OfferItem.builder()
                    .offer(offer)
                    .product(product)
                    .quantity(itemReq.quantity())
                    .unitPrice(itemReq.unitPrice())
                    .discount(discount)
                    .totalPrice(total)
                    .build();
        }).collect(Collectors.toList());

        offer.setItems(items);
        
        // Calculate total offer amount
        BigDecimal totalAmount = items.stream()
                .map(OfferItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        offer.setTotalAmount(totalAmount);

        return mapToResponse(offerRepository.save(offer));
    }

    @Transactional
    public OfferDTO.Response updateStatus(UUID id, OfferStatus status) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found: " + id));
        
        // State transition rules
        if (offer.getStatus() == OfferStatus.ACCEPTED || offer.getStatus() == OfferStatus.REJECTED) {
             throw new BusinessException("Cannot change status of a finalized offer (ACCEPTED or REJECTED).");
        }

        offer.setStatus(status);
        return mapToResponse(offerRepository.save(offer));
    }

    private OfferDTO.Response mapToResponse(Offer offer) {
        List<OfferDTO.ItemResponse> itemResponses = offer.getItems().stream()
                .map(item -> new OfferDTO.ItemResponse(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getSku(),
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getDiscount(),
                        item.getTotalPrice()
                ))
                .collect(Collectors.toList());

        return new OfferDTO.Response(
                offer.getId(),
                offer.getDemand() != null ? offer.getDemand().getId() : null,
                offer.getDemand() != null ? offer.getDemand().getTitle() : null,
                offer.getCustomer().getId(),
                offer.getCustomer().getName(),
                offer.getStatus(),
                offer.getTotalAmount(),
                offer.getCurrency(),
                offer.getValidUntil(),
                itemResponses,
                offer.getCreatedAt()
        );
    }
}
