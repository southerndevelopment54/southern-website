package com.securityco.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "education_levels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "level_name", nullable = false, unique = true, length = 50)
    private String levelName;

    @Column(name = "display_order")
    private Integer displayOrder;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
