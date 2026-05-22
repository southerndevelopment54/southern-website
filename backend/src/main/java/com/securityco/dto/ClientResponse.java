package com.securityco.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ClientResponse {

    private Integer id;
    private String name;
    private String nameEn;
    private String nameCn;
    private String logoKey;
    private String logoUrl;
    private Boolean isFeatured;
    private Integer displayOrder;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
