package com.securityco.repository;

import com.securityco.model.GuardingSite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuardingSiteRepository extends JpaRepository<GuardingSite, Integer> {

    @Query("SELECT s FROM GuardingSite s WHERE s.category = :category AND s.isActive = true ORDER BY s.isFeatured DESC, s.displayOrder ASC")
    List<GuardingSite> findActiveByCategoryOrdered(@Param("category") String category);

    @Query("SELECT s FROM GuardingSite s WHERE s.category = :category AND s.district = :district AND s.isActive = true ORDER BY s.isFeatured DESC, s.displayOrder ASC")
    List<GuardingSite> findActiveByCategoryAndDistrictOrdered(@Param("category") String category, @Param("district") String district);

    @Query("SELECT s FROM GuardingSite s WHERE s.isFeatured = true AND s.isActive = true ORDER BY s.displayOrder ASC")
    List<GuardingSite> findActiveFeaturedOrdered();

    long countByCategoryAndIsActiveTrue(String category);

    long countByCategoryAndIsFeaturedTrueAndIsActiveTrue(String category);
}
