package com.modus.backend.service;

import com.modus.backend.domain.entity.*;
import com.modus.backend.domain.repository.DemandRepository;
import com.modus.backend.domain.repository.ProductRepository;
import com.modus.backend.dto.DemandDTO;
import com.modus.backend.exception.BusinessException;
import com.modus.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DemandService {

    private final DemandRepository demandRepository;
    private final ProductRepository productRepository;

    public List<DemandDTO.Response> getAllDemands() {
        return demandRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DemandDTO.Response getDemand(UUID id) {
        return demandRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Demand not found: " + id));
    }

    @Transactional
    public DemandDTO.Response createDemand(DemandDTO.Request request) {
        Demand demand = Demand.builder()
                .title(request.title())
                .description(request.description())
                .requesterName(request.requesterName())
                .priority(request.priority())
                .dueDate(request.dueDate())
                .status(DemandStatus.DRAFT)
                .build();

        List<DemandItem> items = request.items().stream().map(itemReq -> {
            Product product = productRepository.findById(itemReq.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemReq.productId()));
            
            return DemandItem.builder()
                    .demand(demand)
                    .product(product)
                    .quantity(itemReq.quantity())
                    .note(itemReq.note())
                    .build();
        }).collect(Collectors.toList());

        demand.setItems(items);
        return mapToResponse(demandRepository.save(demand));
    }

    @Transactional
    public DemandDTO.Response updateStatus(UUID id, DemandStatus status) {
        Demand demand = demandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Demand not found: " + id));
        
        // Simple state transition validation
        if (demand.getStatus() == DemandStatus.CANCELLED) {
             throw new BusinessException("Cannot update status of a CANCELLED demand.");
        }
        if (demand.getStatus() == DemandStatus.PROCESSED && status != DemandStatus.CANCELLED) {
             throw new BusinessException("Cannot update status of a PROCESSED demand (unless cancelling).");
        }

        demand.setStatus(status);
        return mapToResponse(demandRepository.save(demand));
    }

    private DemandDTO.Response mapToResponse(Demand demand) {
        List<DemandDTO.ItemResponse> itemResponses = demand.getItems().stream()
                .map(item -> new DemandDTO.ItemResponse(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getSku(),
                        item.getQuantity(),
                        item.getNote()
                ))
                .collect(Collectors.toList());

        return new DemandDTO.Response(
                demand.getId(),
                demand.getTitle(),
                demand.getDescription(),
                demand.getRequesterName(),
                demand.getStatus(),
                demand.getPriority(),
                demand.getDueDate(),
                itemResponses,
                demand.getCreatedAt()
        );
    }
}
