package com.securityco.repository;

import com.securityco.model.EducationLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationLevelRepository extends JpaRepository<EducationLevel, Integer> {
    List<EducationLevel> findAllByOrderByDisplayOrderAsc();
}
