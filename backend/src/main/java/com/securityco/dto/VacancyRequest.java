package com.securityco.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class VacancyRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Guard type is required")
    private Integer guardTypeId;

    private Integer districtId;

    private String locationDescription;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private BigDecimal salaryMin;

    private BigDecimal salaryMax;

    private String salaryDisplay;

    private String salaryPeriod;

    private String employmentType;

    private String jobType;

    private String locationDisplay;

    private List<String> requirements;

    private String description;

    private String contactPhone;

    private String contactEmail;

    @NotNull(message = "isActive is required")
    private Boolean isActive;

    private Boolean isFeatured;

    private Boolean isUrgent;

    private String imageKey;

    private LocalDate expiresAt;
}
