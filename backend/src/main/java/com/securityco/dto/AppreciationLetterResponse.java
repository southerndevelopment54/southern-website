package com.securityco.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AppreciationLetterResponse {

    private Integer id;
    private LocalDate date;
    private String imageKey;
    private String imageUrl;
    private Integer displayOrder;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
