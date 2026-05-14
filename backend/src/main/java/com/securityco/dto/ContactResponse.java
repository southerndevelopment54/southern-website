package com.securityco.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ContactResponse {
    private Integer id;
    private String name;
    private String email;
    private String company;
    private String phone;
    private String serviceType;
    private String message;
    private String ipAddress;
    private String userAgent;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
