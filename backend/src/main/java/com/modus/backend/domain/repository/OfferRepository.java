package com.modus.backend.domain.repository;

import com.modus.backend.domain.entity.Offer;
import com.modus.backend.domain.entity.OfferStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;

public interface OfferRepository extends JpaRepository<Offer, UUID> {
    List<Offer> findByStatus(OfferStatus status);
    List<Offer> findByCustomerId(UUID customerId);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Offer o WHERE o.status = :status")
    BigDecimal sumTotalAmountByStatus(OfferStatus status);
}
