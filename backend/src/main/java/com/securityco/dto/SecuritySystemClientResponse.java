package com.securityco.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SecuritySystemClientResponse {

    private Integer id;
    private String name;
    private String logoKey;
    private String logoUrl;
    private Integer displayOrder;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
