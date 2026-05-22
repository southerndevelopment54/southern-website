package com.securityco.controller;

import com.securityco.dto.GuardingSiteResponse;
import com.securityco.service.GuardingSiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class PublicGuardingSiteController {

    private final GuardingSiteService guardingSiteService;

    @GetMapping
    public ResponseEntity<?> getSites(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) Boolean featured) {

        if (Boolean.TRUE.equals(featured)) {
            return ResponseEntity.ok(guardingSiteService.getFeatured());
        }

        if (category != null && district != null) {
            return ResponseEntity.ok(guardingSiteService.getByCategoryAndDistrict(category, district));
        }

        if (category != null) {
            return ResponseEntity.ok(guardingSiteService.getByCategory(category));
        }

        List<GuardingSiteResponse> all = guardingSiteService.getAllActive();
        return ResponseEntity.ok(all);
    }
}
