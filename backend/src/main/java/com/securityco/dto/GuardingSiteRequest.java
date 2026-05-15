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
    @Pattern(regexp = "commercial|residential|events", message = "Category must be commercial, residential, or events")
    private String category;

    private Boolean isFeatured;

    private Integer displayOrder;

    @NotNull(message = "isActive is required")
    private Boolean isActive;
}
