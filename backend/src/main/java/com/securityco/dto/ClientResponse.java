package com.securityco.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ClientResponse {

    private Integer id;
    private String name;
    private String logoKey;
    private String logoUrl;
    private Integer enterpriseTypeId;
    private String enterpriseTypeName;
    private Boolean isFeatured;
    private Integer displayOrder;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
