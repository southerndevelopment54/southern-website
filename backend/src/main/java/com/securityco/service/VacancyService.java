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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

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
        validateDates(request, true);
        Vacancy vacancy = new Vacancy();
        mapRequestToEntity(request, vacancy);

        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof AdminUserDetails user) {
            vacancy.setCreatedBy(user.getId());
        }

        return toResponse(vacancyRepository.save(vacancy));
    }

    @Transactional
    public VacancyResponse updateVacancy(Integer id, VacancyRequest request) {
        validateDates(request, false);
        Vacancy vacancy = vacancyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vacancy not found"));
        mapRequestToEntity(request, vacancy);
        return toResponse(vacancyRepository.save(vacancy));
    }

    @Transactional
    public void deleteVacancy(Integer id) {
        vacancyRepository.deleteById(id);
    }

    private void validateDates(VacancyRequest request, boolean isNewVacancy) {
        LocalDate today = LocalDate.now();
        // Start date must be in the future only when creating a new vacancy.
        if (isNewVacancy && request.getStartDate() != null && !request.getStartDate().isAfter(today)) {
            throw new IllegalArgumentException("開始日期必須晚於今天");
        }
        // Expiry date must always be in the future.
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

        vacancy.setTitle(request.getTitle());
        vacancy.setGuardType(guardType);
        if (request.getDistrictId() != null && request.getDistrictId() > 0) {
            District district = districtRepository.findById(request.getDistrictId())
                    .orElseThrow(() -> new EntityNotFoundException("District not found"));
            vacancy.setDistrict(district);
        } else {
            vacancy.setDistrict(null);
        }
        vacancy.setLocationDescription(request.getLocationDescription());
        vacancy.setStartDate(request.getStartDate());
        vacancy.setSalaryMin(request.getSalaryMin());
        vacancy.setSalaryMax(request.getSalaryMax());
        vacancy.setSalaryPeriod(request.getSalaryPeriod());
        vacancy.setEmploymentType(request.getEmploymentType());
        vacancy.setWorkingHours(request.getWorkingHours());
        vacancy.setRequirements(request.getRequirements());
        vacancy.setDescription(request.getDescription());
        // Preserve existing contact details when the frontend no longer sends them.
        if (request.getContactPhone() != null) vacancy.setContactPhone(request.getContactPhone());
        if (request.getContactEmail() != null) vacancy.setContactEmail(request.getContactEmail());
        vacancy.setIsActive(request.getIsActive());
        vacancy.setIsFeatured(request.getIsFeatured());
        vacancy.setIsUrgent(request.getIsUrgent() != null ? request.getIsUrgent() : false);
        vacancy.setImageKey(request.getImageKey() != null && !request.getImageKey().isBlank() ? request.getImageKey() : null);
        vacancy.setExpiresAt(request.getExpiresAt());
        vacancy.setUpdatedAt(java.time.LocalDateTime.now());

        // Auto-compute display fields
        boolean showSalary = request.getShowSalary() != null ? request.getShowSalary() : true;
        vacancy.setShowSalary(showSalary);
        vacancy.setSalaryDisplay(showSalary ? computeSalaryDisplay(request.getSalaryMin(), request.getSalaryMax(), request.getSalaryPeriod()) : null);
        vacancy.setJobType(computeJobType(request.getEmploymentType()));
    }

    private String computeSalaryDisplay(BigDecimal min, BigDecimal max, String period) {
        if (min == null || max == null) return "面議";
        String periodLabel = switch (period) {
            case "monthly" -> " / 月";
            case "daily" -> " / 日";
            case "hourly" -> " / 小時";
            case "yearly" -> " / 年";
            default -> "";
        };
        return "$" + min.stripTrailingZeros().toPlainString() + " - $" + max.stripTrailingZeros().toPlainString() + periodLabel;
    }

    private String computeJobType(String employmentType) {
        return switch (employmentType) {
            case "full-time" -> "全職";
            case "part-time" -> "兼職";
            case "contract" -> "合約";
            case "temporary" -> "臨時";
            default -> "全職";
        };
    }

    private VacancyResponse toResponse(Vacancy vacancy) {
        VacancyResponse response = new VacancyResponse();
        response.setId(vacancy.getId());
        response.setTitle(vacancy.getTitle());
        response.setLocationDescription(vacancy.getLocationDescription());
        response.setLocationDisplay(vacancy.getLocationDisplay());
        response.setStartDate(vacancy.getStartDate());
        response.setSalaryMin(vacancy.getSalaryMin());
        response.setSalaryMax(vacancy.getSalaryMax());
        response.setSalaryDisplay(vacancy.getSalaryDisplay());
        response.setSalaryPeriod(vacancy.getSalaryPeriod());
        response.setShowSalary(vacancy.getShowSalary());
        response.setEmploymentType(vacancy.getEmploymentType());
        response.setJobType(vacancy.getJobType());
        response.setWorkingHours(vacancy.getWorkingHours());
        response.setRequirements(vacancy.getRequirements());
        response.setDescription(vacancy.getDescription());
        response.setContactPhone(vacancy.getContactPhone());
        response.setContactEmail(vacancy.getContactEmail());
        response.setIsActive(vacancy.getIsActive());
        response.setIsFeatured(vacancy.getIsFeatured());
        response.setIsUrgent(vacancy.getIsUrgent());
        response.setImageKey(vacancy.getImageKey());
        response.setCreatedBy(vacancy.getCreatedBy());
        response.setCreatedAt(vacancy.getCreatedAt());
        response.setUpdatedAt(vacancy.getUpdatedAt());
        response.setExpiresAt(vacancy.getExpiresAt());

        VacancyResponse.GuardTypeDto gtDto = new VacancyResponse.GuardTypeDto();
        gtDto.setId(vacancy.getGuardType().getId());
        gtDto.setTypeName(vacancy.getGuardType().getTypeName());
        response.setGuardType(gtDto);

        if (vacancy.getDistrict() != null) {
            VacancyResponse.DistrictDto dDto = new VacancyResponse.DistrictDto();
            dDto.setId(vacancy.getDistrict().getId());
            dDto.setDistrictName(vacancy.getDistrict().getDistrictName());
            dDto.setRegion(vacancy.getDistrict().getRegion());
            response.setDistrict(dDto);
        }

        if (vacancy.getImageKey() != null && !vacancy.getImageKey().isBlank()) {
            response.setImageUrl(minioService.getPublicUrl(vacancy.getImageKey()));
        }

        return response;
    }
}
