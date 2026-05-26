package com.securityco.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class GuardingSiteRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String nameEn;

    private String nameCn;

    private String imageKey;

    private String address;

    private String addressEn;

    private String addressCn;

    @NotBlank(message = "Category is required")
    @Pattern(regexp = "commercial|residential|other", message = "Category must be commercial, residential, or other")
    private String category;

    @Pattern(regexp = "|香港|九龍|新界", message = "District must be 香港, 九龍, or 新界")
    private String district;

    @Pattern(regexp = "|hotel|serviced_apartment|large_event|retail_shop", message = "Sub-category must be hotel, serviced_apartment, large_event, or retail_shop")
    private String subCategory;

    private Boolean isFeatured;

    private Integer displayOrder;

    @NotNull(message = "isActive is required")
    private Boolean isActive;
}
