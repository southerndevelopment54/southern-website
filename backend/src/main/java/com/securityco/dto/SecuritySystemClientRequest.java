package com.securityco.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SecuritySystemClientRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String logoKey;

    @NotNull(message = "Display order is required")
    private Integer displayOrder;

    @NotNull(message = "isActive is required")
    private Boolean isActive;
}
