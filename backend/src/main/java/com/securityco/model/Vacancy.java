package com.securityco.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vacancies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vacancy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guard_type_id", nullable = false)
    private SecurityGuardType guardType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id", nullable = true)
    private District district;

    @Column(name = "location_description", length = 255)
    private String locationDescription;

    @Column(name = "location_display", length = 255)
    private String locationDisplay;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "salary_min", precision = 10, scale = 2)
    private BigDecimal salaryMin;

    @Column(name = "salary_max", precision = 10, scale = 2)
    private BigDecimal salaryMax;

    @Column(name = "salary_display", length = 100)
    private String salaryDisplay;

    @Column(name = "salary_period", length = 20)
    private String salaryPeriod;

    @Column(name = "employment_type", length = 20)
    private String employmentType;

    @Column(name = "job_type", length = 50)
    private String jobType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "requirements")
    private List<String> requirements;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(name = "contact_email", length = 100)
    private String contactEmail;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "is_featured")
    private Boolean isFeatured;

    @Column(name = "is_urgent")
    private Boolean isUrgent;

    @Column(name = "image_key", length = 255)
    private String imageKey;

    @Column(name = "created_by")
    private Integer createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "expires_at")
    private LocalDate expiresAt;
}
