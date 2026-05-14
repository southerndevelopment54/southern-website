package com.securityco.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EnterpriseTypeResponse {

    private Integer id;
    private String typeName;
    private Integer displayOrder;
    private LocalDateTime createdAt;
}
