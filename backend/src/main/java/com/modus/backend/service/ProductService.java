package com.modus.backend.service;

import com.modus.backend.domain.entity.Product;
import com.modus.backend.domain.repository.ProductRepository;
import com.modus.backend.dto.ProductRequest;
import com.modus.backend.dto.ProductResponse;
import com.modus.backend.exception.BusinessException;
import com.modus.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsBySku(request.sku())) {
            throw new BusinessException("Product with SKU " + request.sku() + " already exists.");
        }

        Product product = Product.builder()
                .sku(request.sku())
                .name(request.name())
                .description(request.description())
                .unit(request.unit())
                .unitPrice(request.unitPrice())
                .build();

        return mapToResponse(productRepository.save(product));
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getProduct(UUID id) {
        return productRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    private ProductResponse mapToResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getDescription(),
                product.getUnit(),
                product.getUnitPrice(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
