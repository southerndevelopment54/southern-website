package com.securityco.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContactRequest {
    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 100)
    private String company;

    @Pattern(regexp = "^[0-9\\-+\\s]{0,20}$", message = "Invalid phone number format")
    private String phone;

    @NotBlank
    @Email
    @Size(max = 100)
    private String email;

    @Size(max = 100)
    private String serviceType;

    @NotBlank
    @Size(max = 2000)
    private String message;
}
