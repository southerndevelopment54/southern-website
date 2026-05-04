package com.securityco.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "applicant_submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicantSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vacancy_id", nullable = false)
    private Vacancy vacancy;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(length = 100)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "education_level_id")
    private EducationLevel educationLevel;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(name = "has_security_license")
    private Boolean hasSecurityLicense;

    @Column(name = "license_number", length = 50)
    private String licenseNumber;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(length = 20)
    private String status;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
