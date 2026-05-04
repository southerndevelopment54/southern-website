package com.securityco.service;

import com.securityco.dto.DashboardStats;
import com.securityco.dto.SubmissionRequest;
import com.securityco.dto.SubmissionResponse;
import com.securityco.model.ApplicantSubmission;
import com.securityco.model.EducationLevel;
import com.securityco.model.Vacancy;
import com.securityco.repository.ApplicantSubmissionRepository;
import com.securityco.repository.EducationLevelRepository;
import com.securityco.repository.VacancyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final ApplicantSubmissionRepository submissionRepository;
    private final VacancyRepository vacancyRepository;
    private final EducationLevelRepository educationLevelRepository;

    @Transactional
    public SubmissionResponse createSubmission(SubmissionRequest request, String ipAddress) {
        Vacancy vacancy = vacancyRepository.findById(request.getVacancyId())
                .orElseThrow(() -> new EntityNotFoundException("Vacancy not found"));

        ApplicantSubmission submission = new ApplicantSubmission();
        submission.setVacancy(vacancy);
        submission.setFirstName(request.getFirstName());
        submission.setLastName(request.getLastName());
        submission.setPhoneNumber(request.getPhoneNumber());
        submission.setEmail(request.getEmail());
        submission.setYearsOfExperience(request.getYearsOfExperience());
        submission.setHasSecurityLicense(request.getHasSecurityLicense());
        submission.setLicenseNumber(request.getLicenseNumber());
        submission.setMessage(request.getMessage());
        submission.setStatus("new");
        submission.setIpAddress(ipAddress);
        submission.setCreatedAt(LocalDateTime.now());

        if (request.getEducationLevelId() != null) {
            EducationLevel level = educationLevelRepository.findById(request.getEducationLevelId())
                    .orElseThrow(() -> new EntityNotFoundException("Education level not found"));
            submission.setEducationLevel(level);
        }

        return toResponse(submissionRepository.save(submission));
    }

    @Transactional(readOnly = true)
    public Page<SubmissionResponse> listSubmissions(Pageable pageable) {
        return submissionRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public SubmissionResponse getSubmission(Integer id) {
        ApplicantSubmission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Submission not found"));
        return toResponse(submission);
    }

    @Transactional
    public SubmissionResponse updateStatus(Integer id, String status) {
        ApplicantSubmission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Submission not found"));
        submission.setStatus(status);
        submission.setUpdatedAt(LocalDateTime.now());
        return toResponse(submissionRepository.save(submission));
    }

    @Transactional
    public void deleteSubmission(Integer id) {
        submissionRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalVacancies(vacancyRepository.count());
        stats.setActiveVacancies(vacancyRepository.findByIsActiveTrue().size());
        stats.setTotalSubmissions(submissionRepository.count());

        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        long newThisWeek = submissionRepository.findAll().stream()
                .filter(s -> s.getCreatedAt().isAfter(weekAgo))
                .count();
        stats.setNewSubmissionsThisWeek(newThisWeek);

        Map<String, Long> byStatus = submissionRepository.findAll().stream()
                .collect(Collectors.groupingBy(ApplicantSubmission::getStatus, Collectors.counting()));
        stats.setSubmissionsByStatus(byStatus);

        return stats;
    }

    private SubmissionResponse toResponse(ApplicantSubmission submission) {
        SubmissionResponse response = new SubmissionResponse();
        response.setId(submission.getId());
        response.setVacancyId(submission.getVacancy().getId());
        response.setVacancyTitle(submission.getVacancy().getGuardType().getTypeName() + " - " + submission.getVacancy().getDistrict().getDistrictName());
        response.setFirstName(submission.getFirstName());
        response.setLastName(submission.getLastName());
        response.setPhoneNumber(submission.getPhoneNumber());
        response.setEmail(submission.getEmail());
        response.setYearsOfExperience(submission.getYearsOfExperience());
        response.setHasSecurityLicense(submission.getHasSecurityLicense());
        response.setLicenseNumber(submission.getLicenseNumber());
        response.setMessage(submission.getMessage());
        response.setStatus(submission.getStatus());
        response.setCreatedAt(submission.getCreatedAt());
        if (submission.getEducationLevel() != null) {
            response.setEducationLevel(submission.getEducationLevel().getLevelName());
        }
        return response;
    }
}
