package com.securityco.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TierLimitResponse {

    private Integer id;
    private String category;
    private Integer maxCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
