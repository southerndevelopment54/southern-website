package com.securityco.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SubmissionResponse {
    private Integer id;
    private Integer vacancyId;
    private String vacancyTitle;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String educationLevel;
    private Integer yearsOfExperience;
    private Boolean hasSecurityLicense;
    private String licenseNumber;
    private String message;
    private String status;
    private String ipAddress;
    private String userAgent;
    private String adminNotes;
    private Integer reviewedBy;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;
}
