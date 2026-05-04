package com.securityco.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubmissionRequest {
    @NotNull
    private Integer vacancyId;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank
    private String phoneNumber;
    private String email;
    private Integer educationLevelId;
    private Integer yearsOfExperience;
    private Boolean hasSecurityLicense;
    private String licenseNumber;
    private String message;
}
