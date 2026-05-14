package com.securityco.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TierLimitRequest {

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Tier is required")
    @Positive(message = "Tier must be positive")
    private Integer tier;

    @NotNull(message = "Max count is required")
    @Positive(message = "Max count must be positive")
    private Integer maxCount;
}
