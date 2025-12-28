package com.modus.backend.domain.repository;

import com.modus.backend.domain.entity.Demand;
import com.modus.backend.domain.entity.DemandStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface DemandRepository extends JpaRepository<Demand, UUID> {
    List<Demand> findByStatus(DemandStatus status);
    long countByStatus(DemandStatus status);
}
