package com.securityco.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class VacancyResponse {
    private Integer id;
    private GuardTypeDto guardType;
    private DistrictDto district;
    private String locationDescription;
    private LocalDate startDate;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String salaryPeriod;
    private String employmentType;
    private String workingHours;
    private String requirements;
    private String description;
    private String contactPhone;
    private String contactEmail;
    private Boolean isActive;
    private Boolean isFeatured;
    private String imageUrl;
    private LocalDateTime createdAt;
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
