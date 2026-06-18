package com.securityco.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class VacancyResponse {
    private Integer id;
    private String title;
    private GuardTypeDto guardType;
    private DistrictDto district;
    private String locationDescription;
    private String locationDisplay;
    private LocalDate startDate;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String salaryDisplay;
    private String salaryPeriod;
    private Boolean showSalary;
    private String employmentType;
    private String jobType;
    private String workingHours;
    private List<String> requirements;
    private String description;
    private String contactPhone;
    private String contactEmail;
    private Boolean isActive;
    private Boolean isFeatured;
    private Boolean isUrgent;
    private String imageKey;
    private String imageUrl;
    private Integer createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDate expiresAt;

    @Data
    public static class GuardTypeDto {
        private Integer id;
        private String typeName;
    }

    @Data
    public static class DistrictDto {
        private Integer id;
        private String districtName;
        private String region;
    }
}
