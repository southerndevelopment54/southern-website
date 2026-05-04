package com.securityco.repository;

import com.securityco.model.Vacancy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VacancyRepository extends JpaRepository<Vacancy, Integer>, JpaSpecificationExecutor<Vacancy> {
    List<Vacancy> findByIsActiveTrue();
}
