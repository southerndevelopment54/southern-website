package com.securityco.repository;

import com.securityco.model.ApplicantSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicantSubmissionRepository extends JpaRepository<ApplicantSubmission, Integer> {
    List<ApplicantSubmission> findByVacancyId(Integer vacancyId);
    long countByStatus(String status);
}
