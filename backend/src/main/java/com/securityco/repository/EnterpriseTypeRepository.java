package com.securityco.repository;

import com.securityco.model.EnterpriseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnterpriseTypeRepository extends JpaRepository<EnterpriseType, Integer> {
    List<EnterpriseType> findAllByOrderByDisplayOrderAsc();
}
