package com.securityco.controller;

import com.securityco.dto.DashboardStats;
import com.securityco.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final SubmissionService submissionService;

    @GetMapping
    public ResponseEntity<DashboardStats> getStats() {
        return ResponseEntity.ok(submissionService.getDashboardStats());
    }
}
