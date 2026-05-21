package com.securityco.repository;

import com.securityco.model.VacancyInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VacancyInquiryRepository extends JpaRepository<VacancyInquiry, Integer> {
}
