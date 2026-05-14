package com.securityco.repository;

import com.securityco.model.GuardingSite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuardingSiteRepository extends JpaRepository<GuardingSite, Integer> {
    Page<GuardingSite> findByCategoryAndTierAndIsActiveTrueOrderByDisplayOrderAsc(
            String category, Integer tier, Pageable pageable);

    List<GuardingSite> findByCategoryAndTierAndIsActiveTrueOrderByDisplayOrderAsc(
            String category, Integer tier);

    long countByCategoryAndTierAndIsActiveTrue(String category, Integer tier);
}
