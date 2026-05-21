package com.securityco.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VacancyInquiryResponse {
    private Integer id;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String educationLevel;
    private Integer yearsOfExperience;
    private String licenseNumber;
    private String serviceType;
    private String districtPreference;
    private String message;
    private String ipAddress;
    private String userAgent;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
