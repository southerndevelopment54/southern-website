package com.securityco.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "guarding_sites")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuardingSite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "name_en", length = 200)
    private String nameEn;

    @Column(name = "name_cn", length = 200)
    private String nameCn;

    @Column(name = "image_key", length = 255)
    private String imageKey;

    @Column(length = 255)
    private String address;

    @Column(name = "address_en", length = 255)
    private String addressEn;

    @Column(name = "address_cn", length = 255)
    private String addressCn;

    @Column(nullable = false, length = 20)
    private String category;

    @Column(length = 20)
    private String district;

    @Column(name = "is_featured")
    private Boolean isFeatured;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(name = "is_active")
    private Boolean isActive;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
