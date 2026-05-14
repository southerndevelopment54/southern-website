package com.securityco.controller;

import com.securityco.dto.TierLimitRequest;
import com.securityco.dto.TierLimitResponse;
import com.securityco.service.AuditLogService;
import com.securityco.service.TierLimitService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/tier-limits")
@RequiredArgsConstructor
public class AdminTierLimitController {

    private final TierLimitService tierLimitService;
    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<TierLimitResponse>> getAll() {
        return ResponseEntity.ok(tierLimitService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TierLimitResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(tierLimitService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TierLimitResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody TierLimitRequest request,
            HttpServletRequest httpRequest) {
        TierLimitResponse response = tierLimitService.update(id, request);
        auditLogService.log("UPDATE", "tier_limit", id,
                Map.of("category", request.getCategory(), "tier", request.getTier(), "maxCount", request.getMaxCount()),
                getIp(httpRequest));
        return ResponseEntity.ok(response);
    }

    private String getIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        return ip != null && !ip.isEmpty() ? ip : request.getRemoteAddr();
    }
}
