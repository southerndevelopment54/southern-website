package com.securityco.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GuardingSiteResponse {

    private Integer id;
    private String name;
    private String nameEn;
    private String nameCn;
    private String imageKey;
    private String imageUrl;
    private String address;
    private String addressEn;
    private String addressCn;
    private String category;
    private String district;
    private String subCategory;
    private Boolean isFeatured;
    private Integer displayOrder;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
