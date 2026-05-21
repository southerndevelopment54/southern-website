package com.securityco.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class VacancyInquiryRequest {
    @NotBlank
    @Size(max = 100)
    private String firstName;

    @NotBlank
    @Size(max = 100)
    private String lastName;

    @NotBlank
    @Pattern(regexp = "^[0-9\\-+\\s]{0,20}$", message = "Invalid phone number format")
    @Size(max = 20)
    private String phone;

    @NotBlank
    @Email
    @Size(max = 100)
    private String email;

    private Integer educationLevelId;

    private Integer yearsOfExperience;

    @Size(max = 50)
    private String licenseNumber;

    @NotBlank
    @Size(max = 100)
    private String serviceType;

    @Size(max = 100)
    private String districtPreference;

    @Size(max = 2000)
    private String message;
}
