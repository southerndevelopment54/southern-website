package com.securityco.repository;

import com.securityco.model.TierLimit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TierLimitRepository extends JpaRepository<TierLimit, Integer> {
    Optional<TierLimit> findByCategoryAndTier(String category, Integer tier);
}
