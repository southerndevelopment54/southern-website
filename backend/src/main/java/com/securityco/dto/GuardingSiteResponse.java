package com.securityco.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GuardingSiteResponse {

    private Integer id;
    private String name;
    private String imageKey;
    private String imageUrl;
    private String address;
    private String category;
    private Boolean isFeatured;
    private Integer displayOrder;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
