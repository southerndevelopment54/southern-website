package com.securityco.controller;

import com.securityco.dto.GuardingSiteResponse;
import com.securityco.service.GuardingSiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
            @RequestParam(required = false) Integer tier,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        if (category != null && tier != null) {
            return ResponseEntity.ok(guardingSiteService.getByCategoryAndTier(category, tier, page, size));
        }

        List<GuardingSiteResponse> all = guardingSiteService.getAllActive();
        return ResponseEntity.ok(all);
    }
}
