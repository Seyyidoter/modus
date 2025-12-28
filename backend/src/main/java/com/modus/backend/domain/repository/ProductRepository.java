package com.modus.backend.domain.repository;

import com.modus.backend.domain.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    boolean existsBySku(String sku);
    Optional<Product> findBySku(String sku);
}
