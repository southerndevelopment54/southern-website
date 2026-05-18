package com.securityco.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClientRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String logoKey;

    private Boolean isFeatured;

    private Integer displayOrder;

    @NotNull(message = "isActive is required")
    private Boolean isActive;
}
