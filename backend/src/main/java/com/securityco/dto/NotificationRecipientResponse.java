package com.securityco.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationRecipientResponse {

    private Integer id;
    private String email;
    private String name;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
