package com.securityco.service;

import com.securityco.dto.VacancyRequest;
import com.securityco.dto.VacancyResponse;
import com.securityco.model.District;
import com.securityco.model.SecurityGuardType;
import com.securityco.model.Vacancy;
import com.securityco.repository.DistrictRepository;
import com.securityco.repository.SecurityGuardTypeRepository;
import com.securityco.repository.VacancyRepository;
import com.securityco.security.AdminUserDetails;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VacancyService {

    private final VacancyRepository vacancyRepository;
    private final SecurityGuardTypeRepository guardTypeRepository;
    private final DistrictRepository districtRepository;
    private final MinioService minioService;

    @Transactional(readOnly = true)
    public Page<VacancyResponse> listActiveVacancies(Integer districtId, Integer guardTypeId, Pageable pageable) {
        Specification<Vacancy> spec = (root, query, cb) -> {
            var predicates = cb.and(cb.equal(root.get("isActive"), true));
            if (districtId != null) {
                predicates = cb.and(predicates, cb.equal(root.get("district").get("id"), districtId));
            }
            if (guardTypeId != null) {
                predicates = cb.and(predicates, cb.equal(root.get("guardType").get("id"), guardTypeId));
            }
            if (root.get("expiresAt") != null) {
                predicates = cb.and(predicates, cb.or(
                        cb.isNull(root.get("expiresAt")),
                        cb.greaterThanOrEqualTo(root.get("expiresAt"), LocalDate.now())
                ));
            }
            return predicates;
        };
        return vacancyRepository.findAll(spec, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public VacancyResponse getVacancy(Integer id) {
        Vacancy vacancy = vacancyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vacancy not found"));
        return toResponse(vacancy);
    }

    @Transactional(readOnly = true)
    public Page<VacancyResponse> listAllVacancies(Pageable pageable) {
        return vacancyRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional
    public VacancyResponse createVacancy(VacancyRequest request) {
        validateDates(request);
        Vacancy vacancy = new Vacancy();
        mapRequestToEntity(request, vacancy);
        vacancy.setIsActive(true);
        vacancy.setCreatedAt(java.time.LocalDateTime.now());

        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof AdminUserDetails user) {
            vacancy.setCreatedBy(user.getId());
        }

        return toResponse(vacancyRepository.save(vacancy));
    }

    @Transactional
    public VacancyResponse updateVacancy(Integer id, VacancyRequest request) {
        validateDates(request);
        Vacancy vacancy = vacancyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vacancy not found"));
        mapRequestToEntity(request, vacancy);
        return toResponse(vacancyRepository.save(vacancy));
    }

    @Transactional
    public void deleteVacancy(Integer id) {
        vacancyRepository.deleteById(id);
    }

    private void validateDates(VacancyRequest request) {
        LocalDate today = LocalDate.now();
        if (request.getStartDate() != null && !request.getStartDate().isAfter(today)) {
            throw new IllegalArgumentException("開始日期必須晚於今天");
        }
        if (request.getExpiresAt() != null && !request.getExpiresAt().isAfter(today)) {
            throw new IllegalArgumentException("截止日期必須晚於今天");
        }
        if (request.getStartDate() != null && request.getExpiresAt() != null
                && request.getExpiresAt().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("截止日期必須等於或晚於開始日期");
        }
    }

    private void mapRequestToEntity(VacancyRequest request, Vacancy vacancy) {
        SecurityGuardType guardType = guardTypeRepository.findById(request.getGuardTypeId())
                .orElseThrow(() -> new EntityNotFoundException("Guard type not found"));
        District district = districtRepository.findById(request.getDistrictId())
                .orElseThrow(() -> new EntityNotFoundException("District not found"));

        vacancy.setGuardType(guardType);
        vacancy.setDistrict(district);
        vacancy.setLocationDescription(request.getLocationDescription());
        vacancy.setStartDate(request.getStartDate());
        vacancy.setSalaryMin(request.getSalaryMin());
        vacancy.setSalaryMax(request.getSalaryMax());
        vacancy.setSalaryPeriod(request.getSalaryPeriod());
        vacancy.setEmploymentType(request.getEmploymentType());
        vacancy.setWorkingHours(request.getWorkingHours());
        vacancy.setRequirements(request.getRequirements());
        vacancy.setDescription(request.getDescription());
        vacancy.setContactPhone(request.getContactPhone());
        vacancy.setContactEmail(request.getContactEmail());
        vacancy.setIsFeatured(request.getIsFeatured());
        vacancy.setImageKey(request.getImageKey() != null && !request.getImageKey().isBlank() ? request.getImageKey() : null);
        vacancy.setExpiresAt(request.getExpiresAt());
        vacancy.setUpdatedAt(java.time.LocalDateTime.now());
    }

    private VacancyResponse toResponse(Vacancy vacancy) {
        VacancyResponse response = new VacancyResponse();
        response.setId(vacancy.getId());
        response.setLocationDescription(vacancy.getLocationDescription());
        response.setStartDate(vacancy.getStartDate());
        response.setSalaryMin(vacancy.getSalaryMin());
        response.setSalaryMax(vacancy.getSalaryMax());
        response.setSalaryPeriod(vacancy.getSalaryPeriod());
        response.setEmploymentType(vacancy.getEmploymentType());
        response.setWorkingHours(vacancy.getWorkingHours());
        response.setRequirements(vacancy.getRequirements());
        response.setDescription(vacancy.getDescription());
        response.setContactPhone(vacancy.getContactPhone());
        response.setContactEmail(vacancy.getContactEmail());
        response.setIsActive(vacancy.getIsActive());
        response.setIsFeatured(vacancy.getIsFeatured());
        response.setImageKey(vacancy.getImageKey());
        response.setCreatedBy(vacancy.getCreatedBy());
        response.setCreatedAt(vacancy.getCreatedAt());
        response.setExpiresAt(vacancy.getExpiresAt());

        VacancyResponse.GuardTypeDto gtDto = new VacancyResponse.GuardTypeDto();
        gtDto.setId(vacancy.getGuardType().getId());
        gtDto.setTypeName(vacancy.getGuardType().getTypeName());
        response.setGuardType(gtDto);

        VacancyResponse.DistrictDto dDto = new VacancyResponse.DistrictDto();
        dDto.setId(vacancy.getDistrict().getId());
        dDto.setDistrictName(vacancy.getDistrict().getDistrictName());
        dDto.setRegion(vacancy.getDistrict().getRegion());
        response.setDistrict(dDto);

        if (vacancy.getImageKey() != null && !vacancy.getImageKey().isBlank()) {
            response.setImageUrl(minioService.getPresignedUrl(vacancy.getImageKey()));
        }

        return response;
    }
}
