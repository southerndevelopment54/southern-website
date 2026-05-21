package com.securityco.service;

import com.securityco.dto.VacancyInquiryRequest;
import com.securityco.dto.VacancyInquiryResponse;
import com.securityco.model.EducationLevel;
import com.securityco.model.VacancyInquiry;
import com.securityco.repository.EducationLevelRepository;
import com.securityco.repository.VacancyInquiryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class VacancyInquiryService {

    private final VacancyInquiryRepository vacancyInquiryRepository;
    private final EducationLevelRepository educationLevelRepository;

    private static final Pattern HTML_TAG_PATTERN = Pattern.compile("<[^>]*>");

    @Transactional
    public VacancyInquiryResponse save(VacancyInquiryRequest request, String ipAddress, String userAgent) {
        VacancyInquiry inquiry = VacancyInquiry.builder()
                .firstName(sanitize(request.getFirstName()))
                .lastName(sanitize(request.getLastName()))
                .phone(request.getPhone())
                .email(request.getEmail().trim().toLowerCase())
                .yearsOfExperience(request.getYearsOfExperience())
                .licenseNumber(request.getLicenseNumber())
                .serviceType(request.getServiceType())
                .districtPreference(request.getDistrictPreference())
                .message(sanitize(request.getMessage()))
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .isRead(false)
                .build();

        if (request.getEducationLevelId() != null) {
            EducationLevel level = educationLevelRepository.findById(request.getEducationLevelId())
                    .orElseThrow(() -> new EntityNotFoundException("Education level not found"));
            inquiry.setEducationLevel(level);
        }

        return toResponse(vacancyInquiryRepository.save(inquiry));
    }

    @Transactional(readOnly = true)
    public Page<VacancyInquiryResponse> listAll(Pageable pageable) {
        return vacancyInquiryRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public VacancyInquiryResponse getById(Integer id) {
        VacancyInquiry inquiry = vacancyInquiryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vacancy inquiry not found"));
        return toResponse(inquiry);
    }

    @Transactional
    public VacancyInquiryResponse markAsRead(Integer id) {
        VacancyInquiry inquiry = vacancyInquiryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vacancy inquiry not found"));
        inquiry.setIsRead(true);
        return toResponse(vacancyInquiryRepository.save(inquiry));
    }

    @Transactional
    public void delete(Integer id) {
        vacancyInquiryRepository.deleteById(id);
    }

    private String sanitize(String input) {
        if (input == null) return null;
        String noTags = HTML_TAG_PATTERN.matcher(input).replaceAll("");
        return noTags.trim().replaceAll("\\s+", " ");
    }

    private VacancyInquiryResponse toResponse(VacancyInquiry inquiry) {
        VacancyInquiryResponse response = new VacancyInquiryResponse();
        response.setId(inquiry.getId());
        response.setFirstName(inquiry.getFirstName());
        response.setLastName(inquiry.getLastName());
        response.setPhone(inquiry.getPhone());
        response.setEmail(inquiry.getEmail());
        response.setYearsOfExperience(inquiry.getYearsOfExperience());
        response.setLicenseNumber(inquiry.getLicenseNumber());
        response.setServiceType(inquiry.getServiceType());
        response.setDistrictPreference(inquiry.getDistrictPreference());
        response.setMessage(inquiry.getMessage());
        response.setIpAddress(inquiry.getIpAddress());
        response.setUserAgent(inquiry.getUserAgent());
        response.setIsRead(inquiry.getIsRead());
        response.setCreatedAt(inquiry.getCreatedAt());
        if (inquiry.getEducationLevel() != null) {
            response.setEducationLevel(inquiry.getEducationLevel().getLevelName());
        }
        return response;
    }
}
