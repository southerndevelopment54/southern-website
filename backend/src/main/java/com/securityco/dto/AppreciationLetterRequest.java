package com.securityco.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AppreciationLetterRequest {

    @NotNull(message = "Date is required")
    private LocalDate date;

    private String imageKey;

    @NotNull(message = "Display order is required")
    private Integer displayOrder;

    @NotNull(message = "isActive is required")
    private Boolean isActive;
}
