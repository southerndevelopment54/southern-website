package com.securityco.repository;

import com.securityco.model.SecurityGuardType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecurityGuardTypeRepository extends JpaRepository<SecurityGuardType, Integer> {
}
