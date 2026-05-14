package com.securityco.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class GuardingSiteRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String imageKey;

    private String address;

    @NotBlank(message = "Category is required")
    @Pattern(regexp = "key|commercial|residential", message = "Category must be key, commercial, or residential")
    private String category;

    @NotNull(message = "Tier is required")
    private Integer tier;

    private Integer displayOrder;

    @NotNull(message = "isActive is required")
    private Boolean isActive;
}
