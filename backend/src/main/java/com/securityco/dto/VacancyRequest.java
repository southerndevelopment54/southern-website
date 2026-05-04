package com.securityco.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class VacancyRequest {
    @NotNull
    private Integer guardTypeId;
    @NotNull
    private Integer districtId;
    private String locationDescription;
    @NotNull
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
    private Boolean isFeatured;
    private String imageKey;
    private LocalDate expiresAt;
}
